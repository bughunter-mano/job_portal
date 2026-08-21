const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function connectDB() {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_portal';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.log('Local/configured MongoDB not accessible, checking memory database...');
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
      uri = mongod.getUri();
      
      // Ensure the database name is appended
      if (uri.endsWith('/')) {
        uri += 'job_portal';
      } else if (!uri.includes('/job_portal')) {
        uri += '/job_portal';
      }

      await mongoose.connect(uri);
      console.log('MongoDB (Persistent Memory Server) connected successfully at', uri);
    } catch (memErr) {
      console.error('MongoDB connection failed:', err.message);
      console.error('Please configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
      process.exit(1);
    }
  }
}

module.exports = connectDB;
