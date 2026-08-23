// =======================================================
// KRISHI MARKET - FARMER DASHBOARD
// farmer.js
// =======================================================

// API URL
const API_URL = "http://localhost:5000/api";

// =======================================================
// CHECK LOGIN
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    loadFarmerDetails();

    loadDashboardData();

    setupLogout();

});

// =======================================================
// CHECK LOGIN
// =======================================================

function checkLogin() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

        alert("Please login first.");

        window.location.href = "../login/login.html";

        return;

    }

    if (user.role !== "farmer") {

        alert("Access Denied!");

        window.location.href = "../login/login.html";

        return;

    }

}

// =======================================================
// LOAD FARMER DETAILS
// =======================================================

function loadFarmerDetails() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const farmerName = document.getElementById("farmerName");

    if (farmerName) {

        farmerName.innerText =
            user.fullName || user.name || "Farmer";

    }

}

// =======================================================
// LOAD DASHBOARD DATA
// =======================================================

async function loadDashboardData() {

    try {

        // Demo Data
        // Later replace with MongoDB API

        document.getElementById("productCount").innerText = 12;

        document.getElementById("orderCount").innerText = 26;

        document.getElementById("revenue").innerText = "₹18,450";

        document.getElementById("customerCount").innerText = 16;

    }

    catch (error) {

        console.error(error);

    }

}

// =======================================================
// LOGOUT
// =======================================================

function setupLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        const confirmLogout =
            confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        alert("Logged out successfully.");

        window.location.href =
            "../login/login.html";

    });

}

// =======================================================
// OPTIONAL FUTURE API CALL
// =======================================================

async function fetchDashboardFromServer() {

    try {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                `${API_URL}/farmer/dashboard`,
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );

        const data =
            await response.json();

        if (!data.success) return;

        document.getElementById("productCount").innerText =
            data.products;

        document.getElementById("orderCount").innerText =
            data.orders;

        document.getElementById("revenue").innerText =
            "₹" + data.revenue;

        document.getElementById("customerCount").innerText =
            data.customers;

    }

    catch (error) {

        console.log(error);

    }

}