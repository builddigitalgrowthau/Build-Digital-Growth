const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Add user routes here when needed

module.exports = router;
