const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user")


exports.checkAuth = (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        return res.json({ isAuthenticated: true, role: req.session.role });
    } else {
        return res.json({ isAuthenticated: false, role: null });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('my_custom_cookie_name');
        res.json({ message: "Logged out successfully" });
    });
};

exports.postSignup = async (req, res, next) => {
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
        const mobileExistingUser = await User.findOne({ mobile })
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
}

exports.postLogin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Check if user exists and verify password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Set user ID in session
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.isAuthenticated = true;

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

