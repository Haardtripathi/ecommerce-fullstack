const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET; // Store JWT secret in .env

exports.checkAuth = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ isAuthenticated: false, role: null });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ isAuthenticated: true, role: decoded.role });
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false, role: null });
    }
};

exports.logout = (req, res) => {
    // With JWT, logout is handled client-side by simply clearing the token
    res.json({ message: "Logged out successfully." });
};

exports.postSignup = async (req, res) => {
    const { username, password, mobile, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }
        const mobileExistingUser = await User.findOne({ mobile });
        if (mobileExistingUser) {
            return res.status(400).json({ message: "User with this number already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: 'user',
            mobile
        });
        await user.save();

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Check if user exists and verify password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};
