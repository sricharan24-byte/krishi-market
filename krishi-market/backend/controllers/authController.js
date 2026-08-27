const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ==================================================
// REGISTER USER
// ==================================================
const register = async (req, res) => {
    try {
        const {
            fullName,
            name,
            email,
            phone,
            password,
            confirmPassword,
            role
        } = req.body;

        const effectiveName = (fullName || name || "").trim();
        const effectiveEmail = (email || "").toLowerCase().trim();
        const effectivePhone = (phone || "").trim();
        const effectiveRole = (role || "customer").toLowerCase().trim();

        // Required fields
        if (!effectiveName || !effectiveEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password"
            });
        }

        // Validate role
        if (effectiveRole !== "customer" && effectiveRole !== "farmer" && effectiveRole !== "admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid registration role"
            });
        }

        // Check password match if confirmPassword is provided
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "MongoDB database is not connected. Please start local MongoDB or set a valid MONGO_URI in krishi-market/backend/.env"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email: effectiveEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            fullName: effectiveName,
            email: effectiveEmail,
            phone: effectivePhone || "N/A",
            password: hashedPassword,
            role: effectiveRole
        });

        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                _id: newUser._id,
                id: newUser._id,
                fullName: newUser.fullName,
                name: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("❌ REGISTRATION ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered"
            });
        }

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message
        });
    }
};

// ==================================================
// LOGIN USER
// ==================================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "MongoDB database is not connected. Please start local MongoDB or set a valid MONGO_URI in krishi-market/backend/.env"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                id: user._id,
                fullName: user.fullName,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error);
        
        const isDbError = error.message.includes("buffering timed out") || 
                          error.message.includes("ECONNREFUSED") || 
                          error.name === "MongooseError";

        return res.status(500).json({
            success: false,
            message: isDbError
                ? "Database connection failed. Please ensure MongoDB is running or configure MONGO_URI in .env"
                : "Server error during login: " + error.message,
            error: error.message
        });
    }
};

// ==================================================
// GET PROFILE
// ==================================================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id || req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            user: {
                _id: user._id,
                id: user._id,
                fullName: user.fullName,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
};