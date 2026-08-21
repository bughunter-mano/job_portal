const express = require('express');
const router = express.Router();
const {
  getAllJobs, getJobById, createJob, updateJob, deleteJob, getAllJobsAdmin
} = require('../controllers/jobController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/admin/all', verifyAdmin, getAllJobsAdmin); // must be BEFORE /:id
router.get('/:id', getJobById);

// Admin-only routes
router.post('/', verifyAdmin, createJob);
router.put('/:id', verifyAdmin, updateJob);
router.delete('/:id', verifyAdmin, deleteJob);

module.exports = router;
