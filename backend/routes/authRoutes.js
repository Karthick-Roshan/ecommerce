// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const validateUserInput = require('../middleware/validateUserInput');

router.post('/auth/signup', validateUserInput, signup); // apply validation middleware
router.post('/auth/login', login);

module.exports = router;
