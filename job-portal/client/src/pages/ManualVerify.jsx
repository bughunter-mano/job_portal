import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManualVerify() {
  const [certId, setCertId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validate format before hitting the server
  const validateFormat = (id) => {
    // Regex for: CC-YYYY-XXXXXX
    const regex = /^CC-\d{4}-[A-Z0-9]{6}$/;
    return regex.test(id.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formattedId = certId.trim().toUpperCase();

    if (!formattedId) {
      setError('Please enter a certificate ID.');
      return;
    }

    if (!validateFormat(formattedId)) {
      setError('Invalid format. Format must be CC-YYYY-XXXXXX (e.g., CC-2026-XGUJXE).');
      return;
    }

    // Redirect to the verification details page
    navigate(`/verify/${formattedId}`);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20 flex flex-col justify-center min-h-[60vh]">
      <div className="bg-white border border-hair rounded-2xl p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-ink mb-2 text-center">
          Verify Certificate
        </h1>
        <p className="text-sm text-muted mb-6 text-center">
          Enter the unique CodeClub Certificate ID printed on the document.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="certId" className="block text-xs font-mono tracking-wider uppercase text-muted mb-1.5">
              Certificate ID
            </label>
            <input
              type="text"
              id="certId"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="CC-YYYY-XXXXXX"
              className="w-full px-4 py-3 border border-hair rounded-lg text-ink font-mono text-sm focus:outline-none focus:border-teal bg-paper"
            />
            {error && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal hover:bg-teal/90 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm shadow-sm"
          >
            Check Status
          </button>
        </form>

        <div className="mt-8 border-t border-hair pt-6 text-center">
          <p className="text-xs text-muted">
            Format: <code className="bg-paper px-1.5 py-0.5 rounded border border-hair font-mono font-bold text-ink">CC-[Year]-[Code]</code>
          </p>
        </div>
      </div>
    </div>
  );
}
