import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, ShieldAlert, FileCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center animate-slide-up">
      {/* Badge / Announcement */}
      <div className="inline-flex items-center space-x-2 bg-blue-950/50 border border-blue-800/40 rounded-full px-4 py-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
        <ShieldCheck className="w-4 h-4" />
        <span>Enterprise Certificate Verification</span>
      </div>

      {/* Hero Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
        Verify the Achievements of <br />
        <span className="text-gradient font-black">CodeClub Alumni</span>
      </h1>

      <p className="mt-6 text-lg text-slate-400 max-w-2xl">
        A secure, tamper-proof system using HMAC-SHA256 signatures to instantly verify and download professional, authorized certificates of completion.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <Link
          to="/verify"
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto text-base group cursor-pointer"
        >
          <span>Verify Certificate</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/admin/login"
          className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 font-semibold px-8 py-3.5 rounded-xl transition-all w-full sm:w-auto text-base cursor-pointer"
        >
          <span>Admin Portal</span>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Feature 1 */}
        <div className="card-glass p-8 rounded-2xl flex flex-col items-center text-center card-glass-hover">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/25 rounded-xl flex items-center justify-center text-blue-400 mb-5">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Tamper Proof</h3>
          <p className="text-sm text-slate-400">
            Each certificate is cryptographically signed using a unique server-side HMAC key, preventing unauthorized forging.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="card-glass p-8 rounded-2xl flex flex-col items-center text-center card-glass-hover">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-center text-amber-400 mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">QR Enabled</h3>
          <p className="text-sm text-slate-400">
            Downloadable PDFs embed a scannable QR code linking to our verification endpoints for physical certificate validation.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="card-glass p-8 rounded-2xl flex flex-col items-center text-center card-glass-hover">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center justify-center text-red-400 mb-5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Revocation Tracking</h3>
          <p className="text-sm text-slate-400">
            Real-time checking allows administrators to invalidate certificates, instantly updating verification states to warning badges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
