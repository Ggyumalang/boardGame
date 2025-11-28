import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const handleOAuthCallback = (req, res) => {
    // User is already authenticated by Passport and attached to req.user
    const token = generateToken(req.user.id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/success?token=${token}`);
};

export const getMe = (req, res) => {
    res.status(200).json(req.user);
};

export const logout = (req, res) => {
    // For JWT, logout is handled on client side by removing token
    // But if we used cookies, we would clear them here
    res.status(200).json({ message: 'Logged out successfully' });
};
