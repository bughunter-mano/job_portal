import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, Plus, Search, Trash2, Download, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, XCircle, RefreshCw, Calendar, User, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [newCertSuccess, setNewCertSuccess] = useState(null); // stores new cert data + qr code

  // Revocation Modal State
  const [revokeCertId, setRevokeCertId] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeError, setRevokeError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Helper to attach authorization header
  const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const handleApiError = (err) => {
    console.error('API Error:', err);
    if (err.response && err.response.status === 401) {
      const code = err.response.data.code;
      if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_INVALID' || code === 'TOKEN_MISSING') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/admin/login');
        return;
      }
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/certificates?page=${page}&limit=10&search=${search}`,
        getHeaders()
      );
      setCertificates(response.data.certificates);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page or search changes
  useEffect(() => {
    fetchCertificates();
  }, [page, search]);

  const handleCreateCertificate = async (e) => {
    e.preventDefault();
    setFormError('');
    setNewCertSuccess(null);

    if (!studentName || !courseName || !instructorName) {
      setFormError('Please enter Student, Course, and Instructor names.');
      return;
    }

    setFormLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/certificates`,
        {
          studentName,
          courseName,
          instructorName,
          issueDate: new Date(issueDate)
        },
        getHeaders()
      );
      
      setNewCertSuccess(response.data);
      // Clear form
      setStudentName('');
      setCourseName('');
      setInstructorName('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      // Refresh list
      fetchCertificates();
    } catch (err) {
      handleApiError(err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Failed to generate certificate.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeCertId) return;
    setRevokeLoading(true);
    setRevokeError('');
    try {
      await axios.patch(
        `${apiUrl}/certificates/${revokeCertId}/revoke`,
        {},
        getHeaders()
      );
      setRevokeCertId(null);
      fetchCertificates();
    } catch (err) {
      handleApiError(err);
      if (err.response && err.response.data && err.response.data.message) {
        setRevokeError(err.response.data.message);
      } else {
        setRevokeError('Failed to revoke certificate.');
      }
    } finally {
      setRevokeLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-slide-up space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            System Admin: <span className="text-blue-400 font-semibold">{localStorage.getItem('adminEmail')}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Issue Form + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Issue Certificate */}
        <div className="lg:col-span-2 card-glass rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Plus className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Issue New Certificate</h2>
          </div>

          <form onSubmit={handleCreateCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Name</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Complete React Bootcamp"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instructor Name</label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="e.g. Dr. Angela Yu"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>

            {formError && (
              <div className="md:col-span-2 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3">
                {formError}
              </div>
            )}

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 cursor-pointer"
              >
                {formLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>Generate Cryptographic Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success Dialog when certificate created */}
          {newCertSuccess && (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 mt-6 animate-slide-up flex flex-col md:flex-row items-center gap-6">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shrink-0">
                <img src={newCertSuccess.qrCode} alt="Verification QR Code" className="w-full h-full" />
              </div>
              <div className="space-y-3 text-center md:text-left flex-grow">
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Certificate Issued Successfully!</span>
                </div>
                <div className="text-sm text-slate-350 space-y-1">
                  <p><strong>ID:</strong> {newCertSuccess.certificate.certificateId}</p>
                  <p><strong>Student:</strong> {newCertSuccess.certificate.studentName}</p>
                  <p><strong>Course:</strong> {newCertSuccess.certificate.courseName}</p>
                </div>
                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href={`${apiUrl}/certificates/${newCertSuccess.certificate.certificateId}/pdf`}
                    download
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                  <button
                    onClick={() => navigate(`/verify/${newCertSuccess.certificate.certificateId}`)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-750 transition-all cursor-pointer"
                  >
                    View Verification Page
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Info: Verification Stats */}
        <div className="card-glass rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">Registry Metrics</h2>
            <p className="text-xs text-slate-400 mt-1">Live database audit statistics.</p>
          </div>

          <div className="space-y-4 my-6">
            <div className="bg-slate-900/60 rounded-xl p-4 flex items-center justify-between border border-slate-850">
              <span className="text-slate-400 text-sm font-medium">Total Registered</span>
              <span className="text-2xl font-black text-white">{total}</span>
            </div>
            <div className="bg-emerald-950/10 rounded-xl p-4 flex items-center justify-between border border-emerald-950/20">
              <span className="text-emerald-400 text-sm font-medium">Active & Valid</span>
              <span className="text-2xl font-black text-emerald-400">
                {certificates.filter(c => c.status === 'Active').length}
              </span>
            </div>
            <div className="bg-amber-950/10 rounded-xl p-4 flex items-center justify-between border border-amber-950/20">
              <span className="text-amber-400 text-sm font-medium">Revoked / Suspended</span>
              <span className="text-2xl font-black text-amber-500">
                {certificates.filter(c => c.status === 'Revoked').length}
              </span>
            </div>
          </div>

          <div className="bg-blue-950/10 border border-blue-900/20 rounded-xl p-4 text-xs text-blue-300">
            <p className="font-semibold mb-1">💡 Pro-tip for Issuers:</p>
            <p>Ensure student and course titles are spelled correctly before issuing. Re-generating creates a new cryptographic hash and signature.</p>
          </div>
        </div>
      </div>

      {/* Registry Table Section */}
      <div className="card-glass rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span>Certificate Registry</span>
          </h2>
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset to first page on search
              }}
              placeholder="Search by student, course, ID..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-10 pr-4 py-2 text-sm outline-none transition-all placeholder-slate-500"
            />
          </div>
        </div>

        {/* Loading Spinner for Table */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Cert ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Issued By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500 text-sm">
                      No certificates found.
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert._id} className="text-sm hover:bg-slate-900/40 transition-colors group">
                      <td className="py-4 px-4 font-mono text-xs text-blue-400 select-all">
                        {cert.certificateId}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {cert.studentName}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {cert.courseName}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {formatDate(cert.issueDate)}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {cert.issuedBy ? cert.issuedBy.email : 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        {cert.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-900/30">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950 text-amber-400 border border-amber-900/30">
                            Revoked
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`${apiUrl}/certificates/${cert.certificateId}/pdf`}
                            download
                            title="Download PDF"
                            className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-white rounded-lg transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          
                          {cert.status === 'Active' && (
                            <button
                              onClick={() => setRevokeCertId(cert.certificateId)}
                              title="Revoke Certificate"
                              className="p-1.5 bg-red-955/30 hover:bg-red-900/60 border border-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="text-xs text-slate-400">
              Showing <span className="font-semibold text-white">{(page - 1) * 10 + 1}</span> to{' '}
              <span className="font-semibold text-white">
                {Math.min(page * 10, total)}
              </span>{' '}
              of <span className="font-semibold text-white">{total}</span> records
            </div>
            
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-850 text-slate-300 border border-slate-750 rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    page === idx + 1
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-750'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-850 text-slate-300 border border-slate-750 rounded-lg transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Revocation Confirmation Modal */}
      {revokeCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="card-glass border-amber-500/20 max-w-md w-full rounded-2xl p-6 space-y-6 animate-slide-up shadow-2xl relative">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Revoke Certificate?</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Are you sure you want to revoke certificate ID <span className="font-mono text-amber-400 font-semibold">{revokeCertId}</span>?
                </p>
                <p className="text-xs text-red-400 mt-1">
                  Warning: This action is permanent and will flag the certificate as 'Revoked' in the public directory.
                </p>
              </div>
            </div>

            {revokeError && (
              <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-2.5">
                {revokeError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setRevokeCertId(null)}
                disabled={revokeLoading}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-750 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeConfirm}
                disabled={revokeLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-red-500/20 transition-all cursor-pointer"
              >
                {revokeLoading ? 'Revoking...' : 'Yes, Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
