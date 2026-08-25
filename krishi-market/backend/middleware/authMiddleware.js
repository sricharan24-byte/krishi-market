const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "krishi_market_default_secret_key_2026";
        const decoded = jwt.verify(token, secret);

        const userId = decoded.id || decoded._id;

        try {
            const user = await User.findById(userId).select("-password");
            if (user) {
                req.user = user;
            } else {
                req.user = {
                    _id: userId,
                    id: userId,
                    role: decoded.role || "customer",
                    email: decoded.email
                };
            }
        } catch (dbErr) {
            req.user = {
                _id: userId,
                id: userId,
                role: decoded.role || "customer",
                email: decoded.email
            };
        }

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

authMiddleware.protect = authMiddleware;
authMiddleware.authMiddleware = authMiddleware;

module.exports = authMiddleware;
module.exports.protect = authMiddleware;