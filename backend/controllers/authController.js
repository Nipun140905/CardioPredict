const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const sendTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

// POST /auth/google
const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Upsert — find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // New user — signup path
            user = await User.create({
                email,
                name: name || '',
                googleId,
                avatar: picture || null,
            });
        } else {
            // Existing user — update Google info if missing
            if (!user.googleId) user.googleId = googleId;
            if (!user.name && name) user.name = name;
            if (!user.avatar && picture) user.avatar = picture;
            await user.save();
        }

        const token = generateToken(user._id);
        sendTokenCookie(res, token);

        res.status(200).json({
            message: 'Authentication successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Google auth error:', error.message);
        res.status(401).json({ message: 'Invalid Google token', error: error.message });
    }
};

// POST /auth/logout
const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 0
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// GET /auth/me
const getMe = async (req, res) => {
    res.status(200).json({
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            avatar: req.user.avatar,
            created_at: req.user.created_at
        }
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

module.exports = { googleAuth, logout, getMe, deleteAccount };