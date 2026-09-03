const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Global cached connection for Serverless (Vercel / Lambda) environments
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, reuse existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  const isServerlessOrProd = Boolean(
    process.env.VERCEL || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    process.env.NODE_ENV === 'production'
  );

  // 1. If MONGODB_URI is provided, connect to it
  if (uri && uri.trim() && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
    if (!cached.promise) {
      const opts = {
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false
      };
      cached.promise = mongoose.connect(uri.trim(), opts).then((mongooseInstance) => {
        console.log('MongoDB Atlas connected successfully');
        return mongooseInstance;
      }).catch((err) => {
        cached.promise = null;
        console.error('MongoDB Atlas connection failed:', err.message);
        throw err;
      });
    }

    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      if (isServerlessOrProd) {
        throw new Error(`MongoDB connection failed: ${err.message}. Please check MongoDB Atlas IP Whitelist (0.0.0.0/0).`);
      }
    }
  }

  // 2. If running on Vercel/Production without a remote MONGODB_URI
  if (isServerlessOrProd) {
    const errorMsg = 'MONGODB_URI is missing or not configured with MongoDB Atlas in Vercel Environment Variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 3. Local Development Fallbacks (Localhost MongoDB -> MongoMemoryServer)
  const localUri = uri || 'mongodb://127.0.0.1:27017/job_portal';
  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Local MongoDB connected successfully at', localUri);
    cached.conn = conn;
    return cached.conn;
  } catch (err) {
    console.log('Local MongoDB not accessible, attempting local memory database...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '..', 'db_data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }
      const mongod = await MongoMemoryServer.create({
        binary: {
          version: '8.2.6'
        },
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
          persist: true
        }
      });
      let memUri = mongod.getUri();
      if (memUri.endsWith('/')) {
        memUri += 'job_portal';
      } else if (!memUri.includes('/job_portal')) {
        memUri += '/job_portal';
      }

      const conn = await mongoose.connect(memUri);
      console.log('MongoDB (Persistent Memory Server) connected successfully at', memUri);
      cached.conn = conn;
      return cached.conn;
    } catch (memErr) {
      console.error('Local MongoDB connection failed:', err.message);
      console.error('Local memory database fallback failed:', memErr.message);
      console.error('Please configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
    }
  }
}

module.exports = connectDB;
