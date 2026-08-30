const express = require("express");
const cors = require("cors");

const path = require("path");
const fs = require("fs");
const os = require("os");
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

// Helper to get local network IP addresses
function getNetworkIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    return ips;
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
const HOST = process.env.HOST || "0.0.0.0";

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
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
        timestamp: new Date().toISOString(),
        ips: getNetworkIPs()
    });
});

// Dynamic config endpoint for frontends
app.get("/api/config", (req, res) => {
    const networkIPs = getNetworkIPs();
    res.json({
        success: true,
        port: PORT,
        networkIPs: networkIPs,
        localUrl: `http://localhost:${PORT}`,
        networkUrls: networkIPs.map(ip => `http://${ip}:${PORT}`)
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

function printServerBanner(mode = "Live DB") {
    const networkIPs = getNetworkIPs();
    console.log("=================================================");
    console.log(`🌾 Krishi Market Server running (${mode})`);
    console.log(`🏠 Local:   http://localhost:${PORT}`);
    if (networkIPs.length > 0) {
        networkIPs.forEach(ip => {
            console.log(`📱 Network: http://${ip}:${PORT}  <-- Use this on phone/tablet/other PCs`);
        });
    } else {
        console.log(`📱 Network: http://0.0.0.0:${PORT}`);
    }
    console.log("=================================================");
}

if (require.main === module) {
    function startListening(mode) {
        const server = app.listen(PORT, HOST, () => {
            printServerBanner(mode);
        });

        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`\n?O ERROR: Port ${PORT} is already in use by another application or server instance.`);
            } else {
                console.error("?O Server listen error:", err.message);
            }
            process.exit(1);
        });
    }

    console.log("o. Supabase Client Initialized");
    startListening("Supabase DB");
}

module.exports = app;

