const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");


// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "Auth API is working!"

    });

});


// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    register
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    login
);


module.exports = router;