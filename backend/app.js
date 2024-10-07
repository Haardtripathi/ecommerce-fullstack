const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
require('dotenv').config();
const path = require("path");

const config = require("./config/config");

// Import User model
const User = require('./models/user');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create initial admin user
const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ username: process.env.ADMIN });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);
            const newAdmin = new User({
                username: process.env.ADMIN,
                password: hashedPassword,
                role: 'admin',
                mobile: process.env.MOBILE,
                isAuthenticated: false  // Start as not authenticated
            });
            await newAdmin.save();
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Routes setup
app.use('/', authRoutes);

// Basic authentication middleware for protected routes
const basicAuthMiddleware = async (req, res, next) => {
    const username = req.headers['x-username'] || req.params;

    if (!username) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const user = await User.findOne({ username, isAuthenticated: true });
        if (!user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Apply basic auth middleware to protected routes
app.use('/admin', basicAuthMiddleware, adminRoutes);
app.use('/', basicAuthMiddleware, userRoutes);

// Initialize database and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    createAdminUser();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});