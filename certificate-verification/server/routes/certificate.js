const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const adminAuth = require('../middleware/auth');
const { verifyLimiter } = require('../middleware/rateLimiter');
const { calculateHash } = require('../utils/cryptoUtils');
const { generateCertificatePDF } = require('../utils/pdfGenerator');

// @route   POST /api/certificates
// @desc    Create a new certificate (Admin only)
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  const { studentName, courseName, instructorName, issueDate } = req.body;

  if (!studentName || !courseName || !instructorName) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const certDate = issueDate ? new Date(issueDate) : new Date();

    // 1. Generate unique Certificate ID (format: CC-YYYY-XXXXXX)
    let certificateId;
    let isUnique = false;
    const year = certDate.getFullYear();

    while (!isUnique) {
      // 6 characters random uppercase alphanumeric string
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      certificateId = `CC-${year}-${randomPart}`;
      
      const existing = await Certificate.findOne({ certificateId });
      if (!existing) {
        isUnique = true;
      }
    }

    // Temporary object to calculate HMAC hash
    const certPayload = {
      certificateId,
      studentName,
      courseName,
      instructorName,
      issueDate: certDate
    };

    // 2. Generate HMAC-SHA256 Integrity Hash
    const hash = calculateHash(certPayload);

    // 3. Create and Save Certificate
    const newCertificate = new Certificate({
      ...certPayload,
      hash,
      issuedBy: req.admin.id
    });

    await newCertificate.save();

    // 4. Generate QR code pointing to /verify/:certificateId
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify/${certificateId}`;
    
    // Generate base64 QR Code URL
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 250,
      margin: 1
    });

    res.status(201).json({
      certificate: newCertificate,
      qrCode: qrCodeDataUrl,
      verifyUrl
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ message: 'Server error creating certificate.' });
  }
});

// @route   GET /api/certificates
// @desc    Get all certificates with pagination and search (Admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {};
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .populate('issuedBy', 'email')
      .populate('revokedBy', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      certificates,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error fetching certificates.' });
  }
});

// @route   GET /api/verify/:certificateId
// @desc    Verify a certificate by ID (Public with Rate Limit)
// @access  Public
router.get('/verify/:certificateId', verifyLimiter, async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificate = await Certificate.findOne({ certificateId })
      .populate('issuedBy', 'email')
      .populate('revokedBy', 'email');

    if (!certificate) {
      return res.status(200).json({
        verified: false,
        message: 'Certificate not found in database.',
        reason: 'NOT_FOUND'
      });
    }

    // Recalculate hash to check for database tampering
    const recalculatedHash = calculateHash({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      issueDate: certificate.issueDate
    });

    if (recalculatedHash !== certificate.hash) {
      return res.status(200).json({
        verified: false,
        message: 'Security warning: Certificate record signature mismatch. Data may have been tampered with.',
        reason: 'TAMPERED',
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          instructorName: certificate.instructorName,
          issueDate: certificate.issueDate,
          status: 'Invalid'
        }
      });
    }

    // Checked successfully
    res.status(200).json({
      verified: true,
      status: certificate.status,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        issueDate: certificate.issueDate,
        status: certificate.status,
        issuedBy: certificate.issuedBy ? certificate.issuedBy.email : 'Unknown Admin',
        revokedBy: certificate.revokedBy ? certificate.revokedBy.email : null,
        revokedAt: certificate.revokedAt
      }
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error during certificate verification.' });
  }
});

// @route   PATCH /api/certificates/:certificateId/revoke
// @desc    Revoke a certificate (Admin only)
// @access  Private (Admin)
router.patch('/:certificateId/revoke', adminAuth, async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    if (certificate.status === 'Revoked') {
      return res.status(400).json({ message: 'Certificate is already revoked.' });
    }

    certificate.status = 'Revoked';
    certificate.revokedBy = req.admin.id;
    certificate.revokedAt = new Date();

    await certificate.save();

    const updatedCert = await Certificate.findById(certificate._id)
      .populate('issuedBy', 'email')
      .populate('revokedBy', 'email');

    res.status(200).json({
      message: 'Certificate successfully revoked.',
      certificate: updatedCert
    });
  } catch (error) {
    console.error('Error revoking certificate:', error);
    res.status(500).json({ message: 'Server error revoking certificate.' });
  }
});

// @route   GET /api/certificates/:certificateId/pdf
// @desc    Generate and download PDF certificate (Public)
// @access  Public
router.get('/:certificateId/pdf', async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    // Verify hash integrity before generating PDF
    const recalculatedHash = calculateHash({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      issueDate: certificate.issueDate
    });

    if (recalculatedHash !== certificate.hash) {
      return res.status(400).json({ message: 'Cannot generate PDF for a tampered certificate.' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify/${certificateId}`;

    // Set Response Headers for PDF Download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CodeClub_${certificateId}.pdf"`);

    const pdfBuffer = await generateCertificatePDF(certificate, verifyUrl);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error generating PDF.' });
    }
  }
});

module.exports = router;
