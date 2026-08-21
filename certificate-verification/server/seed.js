require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('\n❌ ERROR: ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables (.env file).');
      console.error('Please configure them before running the seed script.\n');
      process.exit(1);
    }

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`\nℹ️ Admin account with email "${email}" already exists. Seeding skipped.`);
    } else {
      // 3. Create Admin
      const newAdmin = new Admin({
        email,
        password
      });

      await newAdmin.save();
      console.log('\n✅ Admin account seeded successfully!');
      console.log(`   Email: ${email}`);
    }

    // 4. Print Security Warning (Requirement 2)
    console.log('\n=============================================================');
    console.log('⚠️  SECURITY WARNING FOR SYSTEM ADMINISTRATOR:');
    console.log('   The admin account has been created with values loaded from env.');
    console.log('   Please change this password immediately after your first login');
    console.log('   to ensure dashboard and system security.');
    console.log('=============================================================\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();
