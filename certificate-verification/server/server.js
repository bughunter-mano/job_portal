require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const adminRoutes = require('./routes/admin');
const certificateRoutes = require('./routes/certificate');

const app = express();

// Connect to MongoDB & Auto-seed Admin
connectDB().then(async () => {
  try {
    const Admin = require('./models/Admin');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@codeclub.com';
      const password = process.env.ADMIN_PASSWORD || 'Admin@CodeClub2026';
      
      const newAdmin = new Admin({ email, password });
      await newAdmin.save();
      
      console.log('\n=============================================================');
      console.log('✅ Auto-Seeded Default Admin Account on Server Boot:');
      console.log(`   Email: ${email}`);
      console.log('-------------------------------------------------------------');
      console.log('⚠️  SECURITY WARNING FOR SYSTEM ADMINISTRATOR:');
      console.log('   The admin account has been created with values loaded from env.');
      console.log('   Please change this password immediately after your first login.');
      console.log('=============================================================\n');
    }
  } catch (err) {
    console.error('Failed to auto-seed admin on server boot:', err);
  }
});

// CORS Configuration (Requirement 6)
// In production, restrict origin to FRONTEND_URL. Otherwise allow all for development.
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificateRoutes);

// Simple Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CodeClub Certificate Verification System Backend is running.' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ 
    message: err.message || 'An internal server error occurred.',
    error: isProduction ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
  console.log(`CORS allowed origin: ${isProduction ? allowedOrigin : 'ALL (*)'}`);
});
