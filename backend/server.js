const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const os = require("os");
require("dotenv").config();

try {
    const dns = require("dns");
    if (process.env.NODE_ENV !== "production") {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }
} catch (e) {}

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

const uploadsDir = path.join(os.tmpdir(), "krishi_uploads");
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {}

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

app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadsDir));

const frontendDir = path.join(__dirname, "../frontend");
if (fs.existsSync(frontendDir)) {
    app.use(express.static(frontendDir));
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Krishi Market API is running smoothly!",
        timestamp: new Date().toISOString(),
        ips: getNetworkIPs()
    });
});

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

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Krishi Market API!"
    });
});

app.use(errorMiddleware);

if (require.main === module) {
    app.listen(PORT, HOST, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;

