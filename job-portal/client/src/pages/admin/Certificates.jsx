import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import api from '../../services/api';

export default function Certificates() {
  // Form States
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(null); // stores { certificate, qrCode, verifyUrl }

  // Input validators (filtering out illegal symbols, digits, and enforcing length limits)
  const handleStudentNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50 && /^[a-zA-Z\s.\-]*$/.test(value)) {
      setStudentName(value);
    }
  };

  const handleCourseNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 80 && /^[a-zA-Z0-9\s.\-()&]*$/.test(value)) {
      setCourseName(value);
    }
  };

  const handleInstructorNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50 && /^[a-zA-Z\s.\-]*$/.test(value)) {
      setInstructorName(value);
    }
  };

  // Registry List States
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [listLoading, setListLoading] = useState(false);

  // Revocation Modal States
  const [revokeCertId, setRevokeCertId] = useState(null);
  const [isSubmittingRevoke, setIsSubmittingRevoke] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch Certificates List
  const fetchCertificates = () => {
    setListLoading(true);
    api.get(`/certificates?page=${page}&limit=10&search=${search}`)
      .then((res) => {
        if (res.data.success) {
          setCertificates(res.data.certificates);
          setTotalPages(res.data.pages);
          setTotalRecords(res.data.total);
        }
      })
      .catch((err) => {
        console.error('Error fetching certificates:', err);
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    fetchCertificates();
  }, [page, search]);

  // Handle Certificate Issue Submission
  const handleIssue = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(null);

    if (!studentName || !courseName || !instructorName) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const payload = {
      studentName,
      courseName,
      instructorName,
      issueDate: issueDate || undefined
    };

    api.post('/certificates', payload)
      .then((res) => {
        if (res.data.success) {
          setFormSuccess(res.data);
          // Clear inputs
          setStudentName('');
          setCourseName('');
          setInstructorName('');
          setIssueDate('');
          // Refresh list to show new record
          setPage(1);
          fetchCertificates();
        }
      })
      .catch((err) => {
        console.error('Error issuing certificate:', err);
        setFormError(err.response?.data?.message || 'Server error issuing certificate.');
      });
  };

  // Handle Revoke Action
  const handleRevokeSubmit = () => {
    if (!revokeCertId) return;
    setIsSubmittingRevoke(true);

    api.patch(`/certificates/${revokeCertId}/revoke`)
      .then((res) => {
        if (res.data.success) {
          setRevokeCertId(null);
          fetchCertificates();
        }
      })
      .catch((err) => {
        console.error('Error revoking certificate:', err);
        alert(err.response?.data?.message || 'Failed to revoke certificate.');
      })
      .finally(() => {
        setIsSubmittingRevoke(false);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <AdminSidebar />
      
      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="font-display text-3xl font-bold mb-8">Manage Certificates</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Issue Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-hair rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold border-b border-hair pb-3 mb-4">Issue Certificate</h2>
              
              <form onSubmit={handleIssue} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono tracking-wider uppercase text-muted">
                      Student Name *
                    </label>
                    <span className="text-[10px] text-muted font-mono">{studentName.length}/50</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={handleStudentNameChange}
                    maxLength={50}
                    placeholder="e.g. Ahmad Ali"
                    className="w-full px-3.5 py-2 border border-hair rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono tracking-wider uppercase text-muted">
                      Course Name *
                    </label>
                    <span className="text-[10px] text-muted font-mono">{courseName.length}/80</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={courseName}
                    onChange={handleCourseNameChange}
                    maxLength={80}
                    placeholder="e.g. Full-Stack Web Development"
                    className="w-full px-3.5 py-2 border border-hair rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono tracking-wider uppercase text-muted">
                      Instructor Name *
                    </label>
                    <span className="text-[10px] text-muted font-mono">{instructorName.length}/50</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={instructorName}
                    onChange={handleInstructorNameChange}
                    maxLength={50}
                    placeholder="e.g. Haris Ali"
                    className="w-full px-3.5 py-2 border border-hair rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-muted mb-1.5">
                    Issue Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-hair rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-teal"
                  />
                </div>

                {formError && (
                  <p className="text-red-600 text-xs font-medium">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-teal hover:bg-teal/90 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                >
                  Generate Certificate
                </button>
              </form>

              {/* Form Success Popup Cards */}
              {formSuccess && (
                <div className="mt-6 border-t border-hair pt-5 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 text-center">
                    <p className="text-sm font-semibold">✅ Certificate Created!</p>
                    <p className="text-xs font-mono mt-1 text-emerald-600">{formSuccess.certificate.certificateId}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={formSuccess.qrCode}
                      alt="Verification QR Code"
                      className="w-36 h-36 border border-hair rounded-lg p-1 bg-paper"
                    />
                    <a
                      href={`${API_URL}/certificates/${formSuccess.certificate.certificateId}/pdf`}
                      download
                      className="text-xs text-teal font-semibold hover:underline"
                    >
                      ⬇️ Download PDF Certificate
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Registry Table & Search */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search filter widget */}
            <div className="bg-white border border-hair rounded-xl p-4 flex gap-3 shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by ID, recipient name, or course..."
                className="flex-1 px-4 py-2 border border-hair rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-teal"
              />
              <span className="bg-paper border border-hair text-muted rounded-lg px-4 py-2 text-xs font-semibold flex items-center font-mono uppercase">
                {totalRecords} Total
              </span>
            </div>

            {/* List Table */}
            <div className="bg-white border border-hair rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-paper border-b border-hair text-xs font-mono tracking-wider uppercase text-muted">
                      <th className="p-4 font-semibold">Certificate ID / Recipient</th>
                      <th className="p-4 font-semibold">Course</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listLoading ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-muted">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-teal mr-2"></div>
                          Loading registry database...
                        </td>
                      </tr>
                    ) : certificates.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-muted">
                          No matching certificate entries found.
                        </td>
                      </tr>
                    ) : (
                      certificates.map((cert) => (
                        <tr key={cert._id} className="border-b border-hair hover:bg-paper/30 transition-colors">
                          <td className="p-4">
                            <p className="font-mono text-xs font-semibold text-ink">{cert.certificateId}</p>
                            <p className="text-sm font-semibold text-teal mt-0.5">{cert.studentName}</p>
                          </td>
                          <td className="p-4 text-xs font-medium leading-relaxed">
                            <p className="font-semibold">{cert.courseName}</p>
                            <p className="text-muted text-[10px] mt-0.5">By: {cert.instructorName} • {formatDate(cert.issueDate)}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono border ${
                              cert.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {cert.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-3">
                            <a
                              href={`${API_URL}/certificates/${cert.certificateId}/pdf`}
                              download
                              className="text-teal font-semibold hover:underline text-xs"
                            >
                              PDF
                            </a>
                            {cert.status === 'Active' && (
                              <button
                                onClick={() => setRevokeCertId(cert.certificateId)}
                                className="text-red-600 font-semibold hover:underline text-xs"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="bg-paper/40 border-t border-hair px-4 py-3.5 flex items-center justify-between">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="border border-hair rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-muted font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="border border-hair rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Revocation Confirmation Overlay Modal */}
      {revokeCertId && (
        <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-hair rounded-2xl p-6 max-w-sm w-full shadow-lg space-y-4">
            <div className="text-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink text-center">
              Confirm Revocation
            </h3>
            <p className="text-xs text-muted leading-relaxed text-center">
              Are you sure you want to revoke the certificate <code className="bg-paper px-1 py-0.5 rounded border border-hair font-mono font-bold text-ink text-[11px]">{revokeCertId}</code>? 
              <br/><span className="text-red-600 font-medium">This action cannot be undone and will remain in the security audit history.</span>
            </p>

            <div className="flex gap-3 pt-2">
              <button
                disabled={isSubmittingRevoke}
                onClick={() => setRevokeCertId(null)}
                className="flex-1 border border-hair rounded-lg py-2.5 text-xs font-semibold hover:bg-paper transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingRevoke}
                onClick={handleRevokeSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors"
              >
                {isSubmittingRevoke ? 'Revoking...' : 'Yes, Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
