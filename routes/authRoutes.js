const express = require('express');
const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const {
  register,
  login,
  updateUser,
} = require('../controllers/authController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);
router.patch('/updateUser', authenticateUser, updateUser);

module.exports = router;
