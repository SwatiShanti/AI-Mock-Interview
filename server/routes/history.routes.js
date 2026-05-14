/**
 * routes/history.routes.js — History routes
 */

const express = require('express');
const router = express.Router();
const { getHistory, getStats, deleteInterview } = require('../controllers/history.controller');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHistory);
router.get('/stats', protect, getStats);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
