import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ManualVerify from './pages/ManualVerify';
import PublicVerify from './pages/PublicVerify';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-brand flex flex-col justify-between">
        <div>
          {/* Global Navbar */}
          <Navbar />

          {/* Page Routing */}
          <main className="px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<ManualVerify />} />
              <Route path="/verify/:certificateId" element={<PublicVerify />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 card-glass border-x-0 border-b-0">
          <p>© {new Date().getFullYear()} CodeClub Verification Registry. All rights reserved.</p>
          <p className="mt-1 text-slate-650">Secure cryptographic integrity assured via HMAC-SHA256 signatures.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
