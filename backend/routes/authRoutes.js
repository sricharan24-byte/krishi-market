const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getProfile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Test Route
router.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth API is working!"
    });
});

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Profile
router.get("/profile", protect, getProfile);

module.exports = router;