const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
    console.log("=================================================");
    console.log("🔍 Checking Krishi Market MongoDB Connection...");
    console.log("=================================================");

    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ ERROR: MONGO_URI is not set in backend/.env file.");
        process.exit(1);
    }

    if (uri.includes("<db_password>") || uri.includes("<password>")) {
        console.error("❌ ERROR: Your MONGO_URI still contains placeholder '<db_password>'.");
        console.log("👉 Please open backend/.env and replace '<db_password>' with your actual MongoDB Atlas database user password.");
        process.exit(1);
    }

    // Mask password in logs for safety
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
    console.log(`Connecting to: ${maskedUri}`);

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000
        });

        console.log("=================================================");
        console.log("✅ MongoDB Connected Successfully!");
        console.log(`Host:     ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name || "default"}`);
        console.log(`State:    Connected (Ready to read & write)`);
        console.log("=================================================");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.log("=================================================");
        console.error("❌ MongoDB Connection Failed!");
        console.error(`Reason: ${error.message}`);
        console.log("=================================================");

        if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
            console.log("💡 Troubleshooting - Authentication Failed:");
            console.log("  1. Verify the database user password in backend/.env is correct.");
            console.log("  2. In MongoDB Atlas, go to 'Database Access' -> check that user 'sricharanyadav707_db_user' exists with Read and Write permissions.");
        } else if (error.message.includes("querySrv") || error.message.includes("ENOTFOUND") || error.message.includes("server selection timeout")) {
            console.log("💡 Troubleshooting - Network / IP Access Blocked:");
            console.log("  1. In MongoDB Atlas, go to 'Network Access' -> click 'Add IP Address'.");
            console.log("  2. Click 'Allow Access from Anywhere' (0.0.0.0/0) or add your current IP address.");
            console.log("  3. Wait 1-2 minutes for Atlas to apply changes and run this test again.");
        }
        process.exit(1);
    }
}

testConnection();
