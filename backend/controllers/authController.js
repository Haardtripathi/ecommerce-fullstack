const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.checkAuth = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.json({ isAuthenticated: false, role: null });
        }

        const user = await User.findOne({ username });
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
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            user.isAuthenticated = false;
            await user.save();
            return res.json({ message: "Logged out successfully" });
        }
        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
    }
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        user.isAuthenticated = true;
        await user.save();

        res.status(200).json({
            message: "Login successful!",
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.postSignup = async (req, res) => {
    const { username, password, mobile, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const mobileExistingUser = await User.findOne({ mobile });
        if (mobileExistingUser) {
            return res.status(400).json({ message: "User with this number already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: 'user',
            mobile,
            isAuthenticated: true
        });
        await user.save();

        res.status(201).json({
            message: "User created successfully.",
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};