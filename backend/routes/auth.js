const express = require('express');
const router = express.Router();
const {
    signup, login, logout, getMe,
    verifyOTP, resendOTP, deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;