const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/certificate_verification';
  
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local/configured MongoDB not running. Initiating in-memory database fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '..', 'db_data');
      
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      // Create persistent memory server using the local db_data folder and cached 8.2.6 binary
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
        uri += 'certificate_verification';
      } else if (!uri.includes('/certificate_verification')) {
        uri += '/certificate_verification';
      }

      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (Persistent Memory Server) at: ${uri}`);
    } catch (memErr) {
      console.error(`Database Connection Error: ${error.message}`);
      console.error(`Memory Database Fallback Error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
