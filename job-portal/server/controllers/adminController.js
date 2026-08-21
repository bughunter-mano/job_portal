const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Job = require('../models/Job');
const Application = require('../models/Application');

// POST /api/admin/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

// GET /api/admin/dashboard
async function dashboard(req, res) {
  try {
    const [totalJobs, activeJobs, totalApplications, pending, accepted, rejected] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Pending' }),
      Application.countDocuments({ status: 'Accepted' }),
      Application.countDocuments({ status: 'Rejected' })
    ]);

    res.json({
      success: true,
      stats: { totalJobs, activeJobs, totalApplications, pending, accepted, rejected }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard stats' });
  }
}

module.exports = { login, dashboard };
