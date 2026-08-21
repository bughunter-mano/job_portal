import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import ApplyJob from './pages/ApplyJob.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import ManualVerify from './pages/ManualVerify.jsx';
import PublicVerify from './pages/PublicVerify.jsx';

import AdminLogin from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminJobs from './pages/admin/Jobs.jsx';
import CreateJob from './pages/admin/CreateJob.jsx';
import EditJob from './pages/admin/EditJob.jsx';
import Applications from './pages/admin/Applications.jsx';
import ApplicationDetails from './pages/admin/ApplicationDetails.jsx';
import AdminClients from './pages/admin/Clients.jsx';
import AdminProjects from './pages/admin/Projects.jsx';
import AdminTestimonials from './pages/admin/Testimonials.jsx';
import AdminCertificates from './pages/admin/Certificates.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public / User routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/jobs" element={<PublicLayout><Jobs /></PublicLayout>} />
      <Route path="/jobs/:id" element={<PublicLayout><JobDetails /></PublicLayout>} />
      <Route path="/apply/:id" element={<PublicLayout><ApplyJob /></PublicLayout>} />
      <Route path="/verify" element={<PublicLayout><ManualVerify /></PublicLayout>} />
      <Route path="/verify/:certificateId" element={<PublicLayout><PublicVerify /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
      <Route path="/admin/jobs/create" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
      <Route path="/admin/jobs/edit/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
      <Route path="/admin/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
      <Route path="/admin/certificates" element={<ProtectedRoute><AdminCertificates /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
