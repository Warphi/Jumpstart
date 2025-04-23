const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const router = express.Router();
const transporter = require('../utils/mailer');

// middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // check authorization header for token by grabbing the second element of the split array
    if (!token) {
        return res.status(401).json({ error: 'Missing auth token.'}); // 401 is unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token.' }); // 401 is unauthorized
    }
}

// register endpoint
// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ error: 'There is already a registered user under this email.' }); // 400 is bad request
        }

        // email verification stuff
        const verificationToken = crypto.randomBytes(32).toString('hex'); // creating a new email verify token
        const verifyURL = `http://localhost:3000/verify/${verificationToken}`;
        await transporter.sendMail({
            from: `Jumpstart App <noreply@jumpstart.warphi.com>`,
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verifyURL}">here</a> to verify your account.</p>`
        });

        const newUser = await User.create({
            name,
            email,
            password,
            verified: false,
            verificationToken
        });

        const pojoUser = newUser.toObject()
        delete pojoUser.password; // remove password from response for security
        delete pojoUser.__v; // remove __v because its unnecessary

        res.status(201).json({ user: pojoUser }); // 201 is created
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering new user' }); // 500 is internal server error
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'This email is not registered.' }); // 404 is not found
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' }); // 401 is unauthorized
        }

        if (!user.verified) {
            return res.status(403).json({ error: 'Please verify your email before logging in.' }); // 403 is forbidden
        }

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {expiresIn: '1d'}); // grant the user a token valid for one day
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' }); // 500 is internal server error
    }
});

// GET /auth/user, returns user's name
router.get('/user', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name');
        if (!user) return res.status(404).json({ error: 'User not found' }); // 404 is not found

        res.json({ name: user.name });
    } catch (err) {
        console.error('Error fetching user name:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) return res.status(400).json({ error: 'Invalid token.' }); // 400 is bad request

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {expiresIn: '1d'}); // grant the user a token valid for one day
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to verify email.' }); // 500 is internal server error
    }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No user found.'}); // 404 is not found

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 1000 * 3600;  // 1 hour from now
        await user.save();

        const resetLink = `http://localhost:3000/reset/${resetToken}`;

        await transporter.sendMail({
            from: `Jumpstart App <noreply@jumpstart.warphi.com>`,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
        });

        res.status(200).json({ message: 'Reset link sent' });
    } catch (err) {
        console.error('Error in forgot-password:', err);
        res.status(500).json({ error: 'Error processing reset request' });
    }
});

// POST /auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Token is invalid or has expired.' });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {expiresIn: '1d'}); // grant the user a token valid for one day
        res.json({ token });
    } catch (err) {
        console.error('Error in reset-password:', err);
        res.status(500).json({ error: 'Error resetting password' });
    }
});

module.exports = router;