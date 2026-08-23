const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = 5000;


// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Auth Routes
app.use("/api/auth", authRoutes);


// Test backend
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Krishi Market Backend is Running!"
    });

});


// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("✅ MongoDB Connected Successfully!");

        app.listen(PORT, () => {

            console.log("=================================");
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 http://localhost:${PORT}`);
            console.log("=================================");

        });

    })
    .catch((error) => {

        console.error(
            "❌ MongoDB Connection Failed!"
        );

        console.error(
            error.message
        );

    });