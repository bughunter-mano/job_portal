const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', imageUploadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (e.g. multer file errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Something went wrong' });
});

module.exports = app;
