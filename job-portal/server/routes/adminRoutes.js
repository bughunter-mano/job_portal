const express = require('express');
const router = express.Router();
const { login, dashboard } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/dashboard', verifyAdmin, dashboard);

module.exports = router;
