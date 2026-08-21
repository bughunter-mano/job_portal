import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, ShieldX, Calendar, User, BookOpen, Download, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

const PublicVerify = () => {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${apiUrl}/certificates/verify/${certificateId}`);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Connection failed. Could not communicate with the verification server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [certificateId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <ShieldCheck className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-white mt-6">Verifying Cryptographic Signature...</h3>
        <p className="text-sm text-slate-400 mt-2">Checking database and validating HMAC integrity hashes.</p>
      </div>
    );
  }

  // 2. Network / Server Error State
  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 animate-slide-up">
        <div className="card-glass border-red-900/40 rounded-2xl p-8 text-center">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white">Verification Error</h3>
          <p className="text-slate-400 mt-2 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={fetchVerification}
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              to="/verify"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to search</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { verified, status, certificate, reason } = result || {};

  // 3. Not Found or Tampered State (Red Card)
  if (!verified) {
    const isTampered = reason === 'TAMPERED';
    return (
      <div className="max-w-xl mx-auto px-6 py-16 animate-slide-up">
        <div className="card-glass border-red-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          {/* Background red glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-5">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-black text-red-500 uppercase tracking-wide">
              {isTampered ? 'Tampering Detected ❌' : 'Invalid Certificate ❌'}
            </h3>
            
            <p className="text-base text-slate-300 mt-3 max-w-md">
              {isTampered 
                ? 'Warning! This certificate database entry exists but its HMAC signature failed verification. The record might have been modified outside of the application server.'
                : `We could not find any certificate matching ID "${certificateId}" in our verification registry. Please check the ID and try again.`
              }
            </p>

            {isTampered && certificate && (
              <div className="w-full bg-red-950/20 border border-red-900/30 rounded-xl p-5 mt-6 text-left space-y-2">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">Tampered Data Signature Details</p>
                <p className="text-sm text-slate-300"><strong className="text-slate-400">ID:</strong> {certificate.certificateId}</p>
                <p className="text-sm text-slate-300"><strong className="text-slate-400">Student:</strong> {certificate.studentName}</p>
                <p className="text-sm text-slate-300"><strong className="text-slate-400">Course:</strong> {certificate.courseName}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link
                to="/verify"
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-2.5 rounded-xl border border-slate-700 w-full sm:w-auto"
              >
                <span>Back to Verify</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Revoked State (Yellow Card)
  if (status === 'Revoked') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 animate-slide-up">
        <div className="card-glass border-amber-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          {/* Background yellow glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col items-center">
            {/* Warning Badge */}
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-5 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-black text-amber-500 uppercase tracking-wide text-center">
              Certificate Revoked ⚠️
            </h3>
            
            <p className="text-sm text-slate-400 mt-2 text-center max-w-md">
              This certificate was officially generated by CodeClub, but has since been marked as **Revoked** and is no longer active.
            </p>

            {/* Certificate Details */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 border-y border-slate-800 py-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Student Name</p>
                  <p className="text-base font-semibold text-white">{certificate.studentName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Course Completed</p>
                  <p className="text-base font-semibold text-white">{certificate.courseName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Issue Date</p>
                  <p className="text-base font-semibold text-white">{formatDate(certificate.issueDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Status</p>
                  <p className="text-base font-semibold text-amber-500">Revoked</p>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="w-full bg-amber-950/10 border border-amber-900/20 rounded-xl p-4 mt-6 text-left">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Revocation Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-400">
                <p><strong>Revoked By:</strong> {certificate.revokedBy || 'System Administrator'}</p>
                <p><strong>Revoked On:</strong> {certificate.revokedAt ? formatDate(certificate.revokedAt) : 'N/A'}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link
                to="/verify"
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 w-full sm:w-auto"
              >
                <span>Check Another ID</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active Verified State (Green Card)
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-slide-up">
      <div className="card-glass border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center">
          {/* Success Check Badge */}
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-5">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-wide text-center">
            Verified ✅
          </h3>
          <p className="text-sm text-slate-400 mt-2 text-center">
            This certificate is authentic, issued by **CodeClub**, and cryptographically validated.
          </p>

          {/* Certificate Detail Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-y border-slate-800 py-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Student Name</p>
                <p className="text-lg font-bold text-white">{certificate.studentName}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Course Name</p>
                <p className="text-lg font-bold text-white">{certificate.courseName}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Issue Date</p>
                <p className="text-lg font-bold text-white">{formatDate(certificate.issueDate)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Instructor</p>
                <p className="text-lg font-bold text-white">{certificate.instructorName}</p>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="w-full bg-slate-900/50 rounded-xl p-4 mt-6 text-left text-xs text-slate-400 space-y-1.5 border border-slate-800">
            <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
            <p><strong>Status:</strong> Active & Verified</p>
            <p><strong>Audited By:</strong> {certificate.issuedBy || 'System Administrator'}</p>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a
              href={`${apiUrl}/certificates/${certificateId}/pdf`}
              download
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 w-full sm:w-auto cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF Certificate</span>
            </a>
            <Link
              to="/verify"
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-750 transition-all w-full sm:w-auto"
            >
              <span>Verify Another ID</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVerify;
