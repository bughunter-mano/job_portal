const app = require('../app');
const connectDB = require('../config/db');
const { seedAdminAuto, seedContent } = require('../seed');

let isSeeded = false;

module.exports = async (req, res) => {
  await connectDB();
  if (!isSeeded) {
    try {
      await seedAdminAuto();
      await seedContent();
      isSeeded = true;
    } catch (e) {
      // Ignore seed error if already executed
    }
  }
  return app(req, res);
};
