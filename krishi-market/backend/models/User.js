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
        },

        address: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            zipCode: { type: String, default: "" },
            country: { type: String, default: "India" }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual("name").get(function () {
    return this.fullName;
}).set(function (val) {
    this.fullName = val;
});

module.exports = mongoose.model("User", userSchema);