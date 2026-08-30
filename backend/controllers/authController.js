const { supabase } = require("../config/database.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
    try {
        const { fullName, name, email, phone, password, confirmPassword, role } = req.body;
        const effectiveName = (fullName || name || "").trim();
        const effectiveEmail = (email || "").toLowerCase().trim();
        const effectivePhone = (phone || "").trim();
        const effectiveRole = (role || "customer").toLowerCase().trim();

        if (!effectiveName || !effectiveEmail || !password) {
            return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
        }
        if (effectiveRole !== "customer" && effectiveRole !== "farmer" && effectiveRole !== "admin") {
            return res.status(400).json({ success: false, message: "Invalid registration role" });
        }
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
        }

        const { data: existingUser } = await supabase.from('users').select('id').eq('email', effectiveEmail).maybeSingle();
        if (existingUser) {
            return res.status(409).json({ success: false, message: "This email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: newUser, error } = await supabase.from('users').insert([{
            full_name: effectiveName,
            email: effectiveEmail,
            phone: effectivePhone || "N/A",
            password: hashedPassword,
            role: effectiveRole
        }]).select().single();

        if (error) throw error;

        const userObj = { _id: newUser.id, id: newUser.id, fullName: newUser.full_name, email: newUser.email, role: newUser.role };
        const token = generateToken(userObj);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: { _id: newUser.id, id: newUser.id, fullName: newUser.full_name, name: newUser.full_name, email: newUser.email, phone: newUser.phone, role: newUser.role }
        });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

        const { data: user, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase().trim()).maybeSingle();
        if (!user || error) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const userObj = { _id: user.id, id: user.id, fullName: user.full_name, email: user.email, role: user.role };
        const token = generateToken(userObj);

        return res.status(200).json({
            success: true, message: "Login successful", token,
            user: { _id: user.id, id: user.id, fullName: user.full_name, name: user.full_name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ success: false, message: "Server error during login", error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
        if (!user || error) return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            user: { _id: user.id, id: user.id, fullName: user.full_name, name: user.full_name, email: user.email, phone: user.phone, role: user.role, address: { street: user.address_street, city: user.address_city, state: user.address_state, zipCode: user.address_zip_code, country: user.address_country } }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, getProfile };
