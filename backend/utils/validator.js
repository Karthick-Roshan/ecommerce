// utils/validator.js

const validator = require('validator');

function validateEmail(email) {
  return validator.isEmail(email);
}

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'Weak';
  if (strength === 3 || strength === 4) return 'Medium';
  return 'Strong';
}

function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

module.exports = {
  validateEmail,
  getPasswordStrength,
  isPasswordValid,
};
