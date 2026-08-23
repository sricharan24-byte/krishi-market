const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==================================================
// REGISTER USER
// ==================================================

const register = async (req, res) => {

    try {

        console.log("=================================");
        console.log("REGISTRATION REQUEST RECEIVED");
        console.log("Request Body:", req.body);
        console.log("=================================");


        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword,
            role
        } = req.body;


        // ==========================================
        // CHECK REQUIRED FIELDS
        // ==========================================

        if (
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword ||
            !role
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });

        }


        // ==========================================
        // CLEAN DATA
        // ==========================================

        const cleanFullName =
            fullName.trim();

        const cleanEmail =
            email.toLowerCase().trim();

        const cleanPhone =
            phone.trim();


        // ==========================================
        // VALIDATE ROLE
        // ==========================================

        if (
            role !== "customer" &&
            role !== "farmer"
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid registration role"
            });

        }


        // ==========================================
        // CHECK PASSWORD MATCH
        // ==========================================

        if (
            password !== confirmPassword
        ) {

            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });

        }


        // ==========================================
        // CHECK PASSWORD LENGTH
        // ==========================================

        if (
            password.length < 6
        ) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });

        }


        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "This email is already registered"
            });

        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==========================================
        // CREATE USER
        // ==========================================

        const newUser =
            await User.create({

                fullName:
                    cleanFullName,

                email:
                    cleanEmail,

                phone:
                    cleanPhone,

                password:
                    hashedPassword,

                role:
                    role

            });


        console.log("=================================");
        console.log("✅ USER REGISTERED SUCCESSFULLY");
        console.log("Name:", newUser.fullName);
        console.log("Email:", newUser.email);
        console.log("Role:", newUser.role);
        console.log("=================================");


        // ==========================================
        // SEND SUCCESS RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

            user: {

                _id:
                    newUser._id,

                fullName:
                    newUser.fullName,

                email:
                    newUser.email,

                phone:
                    newUser.phone,

                role:
                    newUser.role

            }

        });


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "❌ REGISTRATION ERROR"
        );

        console.error(
            "Error Name:",
            error.name
        );

        console.error(
            "Error Message:",
            error.message
        );

        console.error(
            "Full Error:",
            error
        );

        console.error(
            "================================="
        );


        // ==========================================
        // DUPLICATE EMAIL
        // ==========================================

        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "This email is already registered"

            });

        }


        // ==========================================
        // MONGOOSE VALIDATION ERROR
        // ==========================================

        if (
            error.name === "ValidationError"
        ) {

            const messages =
                Object.values(
                    error.errors
                ).map(
                    err => err.message
                );


            return res.status(400).json({

                success: false,

                message:
                    messages.join(", ")

            });

        }


        // ==========================================
        // SERVER ERROR
        // ==========================================

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration",

            error:
                error.message

        });

    }

};


// ==================================================
// LOGIN USER
// ==================================================

const login = async (req, res) => {

    try {

        console.log("=================================");
        console.log("LOGIN REQUEST RECEIVED");
        console.log("=================================");


        const {
            email,
            password
        } = req.body;


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required"

            });

        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        if (!password) {

            return res.status(400).json({

                success: false,

                message:
                    "Password is required"

            });

        }


        // ==========================================
        // FIND USER
        // ==========================================

        const cleanEmail =
            email.toLowerCase().trim();


        const user =
            await User.findOne({

                email:
                    cleanEmail

            });


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ==========================================
        // COMPARE PASSWORD
        // ==========================================

        const isPasswordCorrect =
            await bcrypt.compare(

                password,

                user.password

            );


        // ==========================================
        // WRONG PASSWORD
        // ==========================================

        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        console.log(
            "✅ Login successful:",
            user.email
        );


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            user: {

                _id:
                    user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "❌ LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during login",

            error:
                error.message

        });

    }

};


// ==================================================
// EXPORT CONTROLLERS
// ==================================================

module.exports = {

    register,

    login

};