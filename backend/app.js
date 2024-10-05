const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");
const csrf = require("csurf");
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

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); // Parse JSON requests

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Store for sessions
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI, // Make sure to set this in your .env file
    collection: 'sessions'
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    },
    name: 'my_custom_cookie_name'
}));
// Middleware to expose user data in responses
app.use((req, res, next) => {
    res.locals.user = req.session.userId || null;
    next();
});

// Create a user
const createUser = async () => {
    try {
        const userExists = await User.findOne({ username: 'admin' }); // Check if user already exists
        if (!userExists) {
            const hashedPassword = await bcrypt.hash("admin", 10);
            const newUser = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });

            await newUser.save();
            console.log('Admin user created:', newUser);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

// Call createUser after connecting to the database
connectDB().then(() => {
    createUser();
});

// Routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
