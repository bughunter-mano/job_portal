import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, ShieldCheck, LayoutDashboard, LogOut, LogIn, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check login status on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 card-glass border-x-0 border-t-0 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 text-white group">
          <img src="/assets/codeclub_logo.png" alt="Code Club" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-xl tracking-wider">
            CODE<span className="text-blue-500">CLUB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
              isActive('/') ? 'text-blue-500' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Home</span>
          </Link>
          <Link
            to="/verify"
            className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
              isActive('/verify') ? 'text-blue-500' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify</span>
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isActive('/admin/dashboard') ? 'text-blue-500' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm font-medium bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-900/40 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className={`flex items-center space-x-1 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-all ${
                isActive('/admin/login') ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-4 animate-slide-up">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`text-base font-medium py-2 px-3 rounded-lg ${
              isActive('/') ? 'bg-blue-600/10 text-blue-500' : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-2 text-base font-medium py-2 px-3 rounded-lg ${
              isActive('/verify') ? 'bg-blue-600/10 text-blue-500' : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Verify Certificate</span>
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 text-base font-medium py-2 px-3 rounded-lg ${
                  isActive('/admin/dashboard') ? 'bg-blue-600/10 text-blue-500' : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-2 text-base font-medium bg-red-950/40 text-red-400 py-2.5 px-3 rounded-lg border border-red-900/40 text-left w-full cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-base font-medium bg-slate-800 text-white py-2.5 px-3 rounded-lg border border-slate-700 text-center w-full"
            >
              <LogIn className="w-5 h-5" />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
