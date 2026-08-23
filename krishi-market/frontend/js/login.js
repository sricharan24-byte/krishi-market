// ==========================================
// KRISHI MARKET - LOGIN.JS
// ==========================================

const API_URL = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value
            .trim();

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        const loginButton =
            loginForm.querySelector("button[type='submit']");

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        try {

            console.log("Sending login request...");
            console.log("URL:", `${API_URL}/api/auth/login`);

            // ==========================================
            // SEND REQUEST
            // ==========================================

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            // ==========================================
            // GET RAW RESPONSE FIRST
            // ==========================================

            const responseText = await response.text();

            console.log(
                "HTTP Status:",
                response.status
            );

            console.log(
                "Raw Server Response:",
                responseText
            );

            // ==========================================
            // CHECK EMPTY RESPONSE
            // ==========================================

            if (!responseText) {
                throw new Error(
                    "The server returned an empty response."
                );
            }

            // ==========================================
            // CONVERT RESPONSE TO JSON
            // ==========================================

            let data;

            try {

                data = JSON.parse(responseText);

            } catch (error) {

                console.error(
                    "Server returned non-JSON response:",
                    responseText
                );

                throw new Error(
                    "Server returned an invalid response. " +
                    "Check the browser console for the actual server response."
                );
            }

            console.log(
                "Parsed Server Response:",
                data
            );

            // ==========================================
            // CHECK RESPONSE STATUS
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Login failed."
                );
            }

            // ==========================================
            // GET USER DATA
            // ==========================================

            const user =
                data.user ||
                data.userData ||
                data.data ||
                null;

            if (!user) {

                console.error(
                    "User information missing:",
                    data
                );

                alert(
                    "Login successful, but user information was not returned."
                );

                return;
            }

            // ==========================================
            // SAVE USER DATA
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            if (data.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            if (user._id) {

                localStorage.setItem(
                    "userId",
                    user._id
                );
            }

            if (user.email) {

                localStorage.setItem(
                    "userEmail",
                    user.email
                );
            }

            if (user.role) {

                localStorage.setItem(
                    "userRole",
                    user.role
                );
            }

            // ==========================================
            // LOGIN SUCCESS
            // ==========================================

            alert(
                data.message ||
                "Login successful!"
            );

            // ==========================================
            // ROLE-BASED REDIRECTION
            // ==========================================

            const role =
                user.role
                    ? user.role.toLowerCase().trim()
                    : "";

            if (role === "customer") {

                window.location.href =
                    "customer/customer.html";

            } else if (role === "farmer") {

                window.location.href =
                    "farmer/farmer.html";

            } else if (role === "admin") {

                window.location.href =
                    "admin/admin.html";

            } else {

                alert(
                    "Login successful, but the user role is missing or invalid."
                );

                console.log(
                    "Received role:",
                    user.role
                );
            }

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            alert(
                error.message ||
                "Something went wrong during login."
            );

        } finally {

            if (loginButton) {

                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
}