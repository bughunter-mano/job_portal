import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      login(res.data.admin, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-paper rounded-2xl p-8">
        <p className="font-display text-2xl text-ink text-center mb-1">
          Job<span className="text-gold-dark">Portal</span>
        </p>
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted text-center mb-8">
          Admin Login
        </p>
        {error && <p className="bg-red-50 text-red-600 p-2.5 rounded-lg mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-hair rounded-lg px-4 py-2.5 mt-1.5 bg-white focus:outline-none focus:border-teal transition-colors"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-hair rounded-lg px-4 py-2.5 mt-1.5 bg-white focus:outline-none focus:border-teal transition-colors"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-paper py-3 rounded-full font-medium hover:bg-teal transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
