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

// Routes directory
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Expose user data in responses (this logic might need updates depending on how you're retrieving user data)
app.use(async (req, res, next) => {
    if (req.headers.authorization) {
        const username = req.headers.authorization.split(' ')[1]; // Assuming you'll pass username in the authorization header
        const user = await User.findOne({ username });
        if (user) {
            req.user = user; // Attach user to req if found
        }
    }
    next();
});

// Create initial admin user
const createUser = async () => {
    try {
        const userExists = await User.findOne({ username: process.env.ADMIN });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);
            const newUser = new User({
                username: process.env.ADMIN,
                password: hashedPassword,
                role: 'admin',
                mobile: process.env.MOBILE,
                isAuthenticated: true // Admin user is automatically authenticated
            });
            await newUser.save();
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

// Routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);

// Initialize database and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    createUser();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
