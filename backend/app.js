const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");
const cors = require("cors");
require('dotenv').config();
const path = require("path")

// Import User model
const User = require('./models/user');

// Routes directory
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();


// CORS configuration
app.use(cors({
    origin: "https://enchanting-torrone-2a67a0.netlify.app/", // Allowed frontend origin
    credentials: true, // Required to handle cookies over cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Store for sessions
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true only in production
        sameSite: 'none'
    },
    name: 'my_custom_cookie_name'
}));

// Middleware to expose user data in responses
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
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