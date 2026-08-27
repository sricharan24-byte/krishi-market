// ==========================================
// KRISHI MARKET - LOGIN.JS
// ==========================================

const API_BASE = (typeof config !== "undefined" && config.API_URL)
    ? config.API_URL
    : (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http"))
        ? (!window.location.port || window.location.port === "5000" || window.location.port === "80" || window.location.port === "443")
            ? `${window.location.origin}/api`
            : `${window.location.protocol}//${window.location.hostname}:5000/api`
        : "http://localhost:5000/api";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
        const password = document.getElementById("password") ? document.getElementById("password").value.trim() : "";

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        const loginButton = loginForm.querySelector("button[type='submit']");
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error || "Login failed.");
            }

            const user = data.user || data.userData || data.data || null;

            if (!user) {
                alert("Login successful, but user information was not returned.");
                return;
            }

            // Store across all storage conventions
            if (typeof auth !== "undefined" && auth.setAuth) {
                auth.setAuth(data.token, user);
            } else {
                localStorage.setItem("krishi_market_token", data.token || "");
                localStorage.setItem("krishi_market_user", JSON.stringify(user));
                localStorage.setItem("user", JSON.stringify(user));
                if (data.token) localStorage.setItem("token", data.token);
                if (user._id || user.id) localStorage.setItem("userId", user._id || user.id);
                if (user.email) localStorage.setItem("userEmail", user.email);
                if (user.role) localStorage.setItem("userRole", user.role);
            }

            alert(data.message || "Login successful!");

            // Role-based redirection
            const role = (user.role || "customer").toLowerCase().trim();

            if (role === "customer") {
                window.location.href = "customer/customer.html";
            } else if (role === "farmer") {
                window.location.href = "farmer/farmer.html";
            } else if (role === "admin") {
                window.location.href = "admin/dashboard.html";
            } else {
                window.location.href = "customer/customer.html";
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            alert(error.message || "Something went wrong during login.");
        } finally {
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
}

// ==========================================
// TOGGLE PASSWORD VISIBILITY
// ==========================================
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    if (!passwordInput) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        if (toggleBtn) toggleBtn.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        if (toggleBtn) toggleBtn.textContent = "Show";
    }
}

window.togglePassword = togglePassword;
