const User = require('../models/user'); // Import the User model

const getUserById = async (userId) => {
    return await User.findById(userId);
};

exports.isAuthenticated = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'] || req.params.userId;

        if (userId) {
            const user = await getUserById(userId);
            if (user && user.isAuthenticated) {
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
        const userId = req.headers['x-user-id'] || req.params.userId;

        if (userId) {
            const user = await getUserById(userId);
            if (user && user.isAuthenticated && user.role !== "admin") {
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
        const userId = req.headers['x-user-id'] || req.params.userId;

        if (userId) {
            const user = await getUserById(userId);
            if (user && user.isAuthenticated && user.role === "admin") {
                return next();
            }
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
