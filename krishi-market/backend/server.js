const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Safely configure DNS if in local environment
try {
    const dns = require("dns");
    if (process.env.NODE_ENV !== "production") {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }
} catch (e) {
    // Ignore DNS override errors in restricted environments
}

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import all routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded product images
app.use("/uploads", express.static(uploadsDir));

// Serve frontend static files
const frontendDir = path.join(__dirname, "../frontend");
if (fs.existsSync(frontendDir)) {
    app.use(express.static(frontendDir));
}

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Krishi Market API is running smoothly!",
        timestamp: new Date().toISOString()
    });
});

// Root fallback / test
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Krishi Market API!"
    });
});

// Error handling middleware
app.use(errorMiddleware);

// MongoDB Connection & Server Start (when executed directly)
if (require.main === module) {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/krishi_market";

    mongoose
        .connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        })
        .then(() => {
            console.log("✅ MongoDB Connected Successfully!");
            app.listen(PORT, () => {
                console.log("=================================");
                console.log(`✅ Krishi Market Server running on port ${PORT}`);
                console.log(`🌐 Local: http://localhost:${PORT}`);
                console.log("=================================");
            });
        })
        .catch((error) => {
            console.error("❌ MongoDB Connection Warning:", error.message);
            console.log("⚠️ Starting server in standalone mode (database queries will retry)...");
            app.listen(PORT, () => {
                console.log("=================================");
                console.log(`✅ Server running on port ${PORT} (Offline DB mode)`);
                console.log(`🌐 Local: http://localhost:${PORT}`);
                console.log("=================================");
            });
        });
}

module.exports = app;
