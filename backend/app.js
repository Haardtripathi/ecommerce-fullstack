const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
require('dotenv').config();
const path = require("path");

// Import User model
const User = require('./models/user');

// Routes directory
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
app.use(cors({
    origin: "https://ecomm-frontend-proj1.netlify.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
}));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to expose user data in responses (can be removed with JWT)
app.use((req, res, next) => {
    res.locals.user = req.user || null;
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
                mobile: process.env.MOBILE
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
