import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

const ManualVerify = () => {
  const [certId, setCertId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = certId.trim().toUpperCase();

    if (!trimmedId) {
      setError('Please enter a certificate ID.');
      return;
    }

    // Format validation: CC-YYYY-XXXXXX (where YYYY is 4 digits, XXXXXX is 6 alphanumeric chars)
    const pattern = /^CC-\d{4}-[A-Z0-9]{6}$/;
    if (!pattern.test(trimmedId)) {
      setError('Invalid ID format. Correct format is: CC-YYYY-XXXXXX (e.g. CC-2026-X1Y2Z3)');
      return;
    }

    // Route to verification page
    navigate(`/verify/${trimmedId}`);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 md:py-24 animate-slide-up">
      <div className="card-glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Verify a Certificate</h2>
          <p className="text-sm text-slate-400 text-center mt-2">
            Enter the unique CodeClub certificate identification number printed at the bottom of the certificate.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Certificate ID
            </label>
            <input
              type="text"
              value={certId}
              onChange={(e) => {
                setCertId(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. CC-2026-A1B2C3"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-3 text-base placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-start space-x-2 text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
          >
            <span>Check Authenticity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-start space-x-2.5 text-slate-400">
          <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-medium text-slate-300">Where is my certificate ID?</p>
            <p>You can find the certificate ID on the PDF download or in the verification URL.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualVerify;
