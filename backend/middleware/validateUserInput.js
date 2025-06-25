// middleware/validateUserInput.js

const {
  validateEmail,
  getPasswordStrength,
  isPasswordValid,
} = require('../utils/validator');

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const strength = getPasswordStrength(password);
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      message: `Password is too weak. Must be at least 8 characters long and include uppercase, lowercase, number, and special character.`,
      strength,
    });
  }

  // You can optionally send the strength in a header or response if needed
  req.passwordStrength = strength;
  next();
};
