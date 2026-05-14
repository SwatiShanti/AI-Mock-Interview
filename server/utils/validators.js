const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    success: false,
    errors: extractedErrors,
    message: errors.array()[0].msg
  });
};

/**
 * Signup validation rules
 */
const signupValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

/**
 * Login validation rules
 */
const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

/**
 * Interview setup validation rules
 */
const interviewSetupValidationRules = () => {
  return [
    body('jobRole').notEmpty().withMessage('Job role is required'),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
    body('questionCount').optional().isInt({ min: 3, max: 10 }).withMessage('Question count must be between 3 and 10'),
    body('jobDescription').optional().isLength({ max: 2000 }).withMessage('Job description is too long'),
  ];
};

/**
 * Interview submission validation rules
 */
const interviewSubmissionValidationRules = () => {
  return [
    body('interviewId').isMongoId().withMessage('Invalid interview ID'),
    body('answers').isArray({ min: 1 }).withMessage('Answers must be an array'),
    body('duration').optional().isInt({ min: 0 }).withMessage('Invalid duration'),
  ];
};

module.exports = {
  validate,
  signupValidationRules,
  loginValidationRules,
  interviewSetupValidationRules,
  interviewSubmissionValidationRules
};
