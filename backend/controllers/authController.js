const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../services/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const sendTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

// POST /auth/signup
const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (!/\d/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one number' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (existingUser && !existingUser.isVerified) {
            // Resend OTP to existing unverified user
            existingUser.password = password;
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;
            await existingUser.save();
        } else {
            await User.create({ email, password, otp, otpExpiry });
        }

        await sendOTPEmail(email, otp);

        res.status(200).json({
            message: 'OTP sent to your email',
            email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /auth/verify-otp
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = generateToken(user._id);
        sendTokenCookie(res, token);

        res.status(200).json({
            message: 'Email verified successfully',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /auth/resend-otp
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first', email });
        }

        const token = generateToken(user._id);
        sendTokenCookie(res, token);

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /auth/logout
const logout = async (req, res) => {
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
};

// GET /auth/me
const getMe = async (req, res) => {
    res.status(200).json({
        user: { id: req.user._id, email: req.user.email, created_at: req.user.created_at }
    });
};

// DELETE /auth/delete-account
const deleteAccount = async (req, res) => {
    try {
        const Prediction = require('../models/Prediction');
        await Prediction.deleteMany({ user_id: req.user._id });
        await User.findByIdAndDelete(req.user._id);
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, login, logout, getMe, verifyOTP, resendOTP, deleteAccount };