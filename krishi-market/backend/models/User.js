const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        role: {
            type: String,
            required: [true, "Role is required"],
            enum: ["customer", "farmer", "admin"],
            default: "customer"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);