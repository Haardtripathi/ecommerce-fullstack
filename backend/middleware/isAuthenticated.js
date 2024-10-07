
// Middleware for session-based authentication
const User = require('../models/user'); // Import the User model

exports.isAuthenticated = async (req, res, next) => {
    try {
        if (req.session.userId && req.session.isAuthenticated) {
            const user = await User.findById(req.session.userId);
            console.log(user)
            if (user) {
                req.user = user; // Attach user object to req
                return next();
            }
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.isNotAdmin = async (req, res, next) => {
    try {
        if (req.session.userId && req.session.isAuthenticated) {
            const user = await User.findById(req.session.userId);
            if (user.role !== "admin") {
                return next();
            }
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.session.userId && req.session.isAuthenticated) {
            const user = await User.findById(req.session.userId);
            if (user.role === "admin") {
                return next();
            }
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};