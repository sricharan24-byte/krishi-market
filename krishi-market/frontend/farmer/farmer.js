// =======================================================
// KRISHI MARKET - FARMER DASHBOARD
// farmer.js
// =======================================================

// API URL (Dynamic for multi-device/network access)
const API_URL = (typeof config !== "undefined" && config.API_URL)
    ? config.API_URL
    : (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http"))
        ? (!window.location.port || window.location.port === "5000" || window.location.port === "80" || window.location.port === "443")
            ? `${window.location.origin}/api`
            : `${window.location.protocol}//${window.location.hostname}:5000/api`
        : "http://localhost:5000/api";

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
    const rawUser = localStorage.getItem("krishi_market_user") || localStorage.getItem("user");
    let user = null;
    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {
        user = null;
    }

    if (!user) {
        alert("Please login first.");
        window.location.href = "../login.html";
        return;
    }

    if (user.role !== "farmer" && user.role !== "admin") {
        alert("Access Denied! Farmer role required.");
        window.location.href = "../login.html";
        return;
    }
}

// =======================================================
// LOAD FARMER DETAILS
// =======================================================

function loadFarmerDetails() {
    const rawUser = localStorage.getItem("krishi_market_user") || localStorage.getItem("user");
    let user = null;
    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {}

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
        // Try fetching real farmer products if available
        const token = localStorage.getItem("krishi_market_token") || localStorage.getItem("token");
        if (token) {
            const res = await fetch(`${API_URL}/products/my-products`, {
                headers: { "Authorization": `Bearer ${token}` }
            }).catch(() => null);

            if (res && res.ok) {
                const prods = await res.json();
                const productCountEl = document.getElementById("productCount");
                if (productCountEl) productCountEl.innerText = prods.length;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// =======================================================
// LOGOUT
// =======================================================

function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        localStorage.removeItem("krishi_market_user");
        localStorage.removeItem("krishi_market_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        alert("Logged out successfully.");
        window.location.href = "../login.html";
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