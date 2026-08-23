const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file");
        }

        console.log("MongoDB URI loaded: YES");

        const conn = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

        console.log(
            `✅ MongoDB connected successfully: ${conn.connection.host}`
        );

        return true;

    } catch (error) {

        console.error("❌ MongoDB connection failed:");
        console.error(error.message);

        return false;
    }
};

module.exports = connectDB;