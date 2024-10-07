const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

exports.isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId); // Attach user to req
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isNotAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            req.user = await User.findById(decoded.userId);
            return next();
        }
        return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') {
            req.user = await User.findById(decoded.userId);
            return next();
        }
        return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
