/**
 * utils/generateToken.js — JWT token generation utility
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user
 * @param {string} userId - MongoDB user _id
 * @returns {string} signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
