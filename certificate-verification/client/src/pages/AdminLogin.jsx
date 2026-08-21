import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // If already logged in, skip login page
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/login`, {
        email,
        password
      });

      // Save token and email to localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminEmail', response.data.admin.email);

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 md:py-24 animate-slide-up">
      <div className="card-glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Authentication</h2>
          <p className="text-sm text-slate-400 mt-2 text-center">
            Sign in to access the CodeClub certificate management dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="admin@codeclub.com"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-12 pr-4 py-3 text-base placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-12 pr-4 py-3 text-base placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start space-x-2 text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
