import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function PublicVerify() {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    setLoading(true);
    setError('');
    
    api.get(`/certificates/verify/${certificateId}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        } else {
          setError(res.data.message || 'Verification check failed.');
        }
      })
      .catch((err) => {
        console.error('Verify error:', err);
        setError('Network error or server connection failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [certificateId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal"></div>
        <p className="text-sm font-medium text-muted mt-4">Verifying digital signature & cryptographic HMAC hash...</p>
      </div>
    );
  }

  // Helper for formatted dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // State 1: Tampered/Not Found or General Error
  if (error || (data && !data.verified)) {
    const isTampered = data && data.reason === 'TAMPERED';
    return (
      <div className="max-w-xl mx-auto px-5 py-12 min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-red-900 text-center mb-2">
            {isTampered ? 'Security Mismatch: Tampering Detected' : 'Certificate Not Found'}
          </h1>
          <p className="text-sm text-red-700 text-center mb-6 leading-relaxed">
            {isTampered 
              ? 'Security check failed. The database records do not match the cryptographic HMAC SHA-256 signature hash. This certificate has been altered or is invalid.'
              : 'This certificate ID does not exist in the CodeClub official verification database.'}
          </p>

          {isTampered && data.certificate && (
            <div className="bg-white border border-red-100 rounded-xl p-5 mb-6 text-sm font-mono text-ink space-y-2">
              <p><span className="text-muted font-sans font-medium">Certificate ID:</span> {data.certificate.certificateId}</p>
              <p><span className="text-muted font-sans font-medium">Student Name:</span> {data.certificate.studentName}</p>
              <p><span className="text-muted font-sans font-medium">Course:</span> {data.certificate.courseName}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to="/verify"
              className="text-center bg-red-900 hover:bg-red-950 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm shadow-sm"
            >
              Search Another Certificate
            </Link>
            <Link
              to="/"
              className="text-center text-red-900 hover:underline text-xs"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { certificate, status } = data;
  const isRevoked = status === 'Revoked';

  // Calculate clean course/role
  let cleanCourse = (certificate.courseName || 'Frontend developer')
    .replace(/course|certified|bootcamp/gi, '')
    .trim();
  if (!cleanCourse.toLowerCase().includes('developer') && !cleanCourse.toLowerCase().includes('designer') && !cleanCourse.toLowerCase().includes('engineer')) {
    cleanCourse += ' developer';
  }
  const firstLetter = cleanCourse.charAt(0).toLowerCase();
  const article = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';

  // Calculate dates
  const endDateVal = new Date(certificate.issueDate || Date.now());
  const startDateVal = new Date(endDateVal.getTime() - 28 * 24 * 60 * 60 * 1000);
  const formattedStart = formatDate(startDateVal);
  const formattedEnd = formatDate(endDateVal);
  const cleanIdDigits = certificate.certificateId.replace(/\D/g, '') || certificate.certificateId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[75vh]">
      {/* Top Status Banner */}
      {isRevoked ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center shadow-sm">
          <span className="text-3xl mb-2 inline-block">⚠️</span>
          <h2 className="text-xl font-bold text-amber-900">Certificate Has Been Revoked</h2>
          <p className="text-xs text-amber-700 mt-1 font-mono uppercase tracking-widest">Status: Inactive / Revoked</p>
          <div className="mt-3 text-xs text-amber-800">
            Revoked by {certificate.revokedBy || 'Admin'} on {formatDate(certificate.revokedAt)}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl flex-shrink-0">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h2 className="text-lg font-bold text-emerald-950">Official Certificate Verified</h2>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Authentic
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Cryptographic HMAC SHA-256 integrity signature validated against Code Club database.
              </p>
            </div>
          </div>
          <a
            href={`${API_URL}/certificates/${certificate.certificateId}/pdf`}
            download
            className="flex-shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm shadow flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>
        </div>
      )}

      {/* Certificate Live Canvas with Authentic #FFFDF1 Background */}
      <div className="bg-[#FFFDF1] border border-[#ECE9D8] rounded-2xl shadow-xl overflow-hidden relative p-8 md:p-12 mb-8">
        {/* Subtle Watermark in Background Behind Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.055] select-none">
          <img
            src="/assets/codeclub_watermark.png"
            alt="Watermark"
            className="w-[430px] max-w-[85%] object-contain"
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Real Top Logo */}
          <div className="flex justify-center mb-3">
            <img
              src="/assets/codeclub_logo.png"
              alt="Code Club Logo"
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>

          <h3 className="font-extrabold text-lg md:text-xl text-black tracking-wider uppercase">
            CODE CLUB
          </h3>
          <p className="font-bold text-xs md:text-sm text-black tracking-wide uppercase mb-6">
            (SMC-PRIVATE) LIMITED
          </p>

          <h1 className="font-bold text-xl md:text-3xl text-[#4E81A4] tracking-[0.15em] uppercase mb-4">
            CERTIFICATE OF INTERNSHIP
          </h1>

          <p className="text-xs md:text-sm font-bold text-[#333333] tracking-widest uppercase mb-2">
            THIS CERTIFICATE GOES TO
          </p>

          <h2 className="font-extrabold text-3xl md:text-5xl text-black my-3 font-sans">
            {certificate.studentName}
          </h2>

          <p className="text-xs md:text-sm text-[#555555] font-sans mb-3">
            Internee id:{certificate.certificateId}
          </p>

          <div className="max-w-2xl mx-auto text-xs md:text-sm text-[#555555] leading-relaxed mb-4">
            <p>In recognition of his successful efforts, dedication, and outstanding performance</p>
            <p>during his internship as {article} {cleanCourse} at Code Club (SMC-PRIVATE)</p>
            <p className="font-semibold">LIMITED</p>
          </div>

          <p className="text-xs md:text-sm text-[#555555] font-sans mb-10">
            Duration: {formattedStart} to {formattedEnd}
          </p>

          {/* Bottom Bar: QR Code & Signature */}
          <div className="flex items-end justify-between pt-4 mt-8 border-t border-gray-200/60">
            {/* QR Code with Matching Ivory Background */}
            <div className="text-left flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&bgcolor=FFFDF1&data=${encodeURIComponent(window.location.href)}`}
                alt="Verification QR"
                className="w-20 h-20 md:w-24 md:h-24 rounded border border-gray-200 shadow-sm bg-[#FFFDF1] p-1"
              />
              <span className="text-[10px] text-gray-500 font-mono mt-1">Scan to Verify</span>
            </div>

            {/* Signature Block */}
            <div className="flex flex-col items-center w-48 md:w-56">
              <img
                src="/assets/codeclub_signature.png"
                alt="Muhammad Affan Signature"
                className="h-10 md:h-12 object-contain mb-1"
              />
              <div className="w-full h-1 bg-[#444F5A] rounded-full mb-1"></div>
              <p className="font-bold text-xs md:text-sm text-[#4E81A4]">Muhammad Affan</p>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest">CTO/SECRETARY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-center gap-4 text-xs text-muted">
        <Link to="/verify" className="hover:text-teal underline">
          ← Verify Another Certificate
        </Link>
        <span>•</span>
        <Link to="/" className="hover:text-teal underline">
          Go to Job Portal Home
        </Link>
      </div>
    </div>
  );
}
