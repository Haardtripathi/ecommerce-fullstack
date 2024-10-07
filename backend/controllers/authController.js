const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Assuming req.user is populated with authenticated user's data
        if (user && user.isAuthenticated) {
            return res.json({ isAuthenticated: true, role: user.role });
        } else {
            return res.json({ isAuthenticated: false, role: null });
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Assuming req.user is populated
        if (user) {
            user.isAuthenticated = false; // Set the user's isAuthenticated to false
            await user.save();
        }
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
    }
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
            mobile,
            isAuthenticated: true // Set isAuthenticated to true upon signup
        });
        await user.save();

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error('Error during signup:', error);
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

        // Set user as authenticated
        user.isAuthenticated = true; // Set isAuthenticated to true
        await user.save();

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};
