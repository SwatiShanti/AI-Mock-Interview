/**
 * routes/interview.routes.js — Interview routes
 */

const express = require('express');
const router = express.Router();
const { startInterview, submitInterview, getInterview } = require('../controllers/interview.controller');
const { protect } = require('../middleware/authMiddleware');
const { interviewSetupValidationRules, interviewSubmissionValidationRules, validate } = require('../utils/validators');

router.post('/start', protect, interviewSetupValidationRules(), validate, startInterview);
router.post('/submit', protect, interviewSubmissionValidationRules(), validate, submitInterview);
router.get('/:id', protect, getInterview);

module.exports = router;
