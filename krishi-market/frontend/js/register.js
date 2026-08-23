// ==========================================
// KRISHI MARKET - REGISTER JS
// ==========================================

// Backend API URL
const API_URL = "http://localhost:5000/api/auth";


// ==========================================
// GET REGISTER FORM
// ==========================================

const registerForm = document.getElementById("registerForm");


// ==========================================
// FORM SUBMIT
// ==========================================

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        // Stop normal form submission
        event.preventDefault();


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const nameInput =
            document.getElementById("name");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const confirmPasswordInput =
            document.getElementById("confirmPassword");


        // Get role
        const selectedRole =
            document.querySelector(
                'input[name="role"]:checked'
            );


        // Get values
        const name =
            nameInput ? nameInput.value.trim() : "";

        const email =
            emailInput
                ? emailInput.value.trim().toLowerCase()
                : "";

        const password =
            passwordInput
                ? passwordInput.value
                : "";

        const confirmPassword =
            confirmPasswordInput
                ? confirmPasswordInput.value
                : "";

        const role =
            selectedRole
                ? selectedRole.value
                : "customer";


        // ==========================================
        // VALIDATE NAME
        // ==========================================

        if (!name) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            return;
        }


        // ==========================================
        // VALIDATE EMAIL
        // ==========================================

        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            return;
        }


        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        // ==========================================
        // VALIDATE PASSWORD
        // ==========================================

        if (!password) {

            showMessage(
                "Please enter a password.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        // ==========================================
        // CONFIRM PASSWORD
        // ==========================================

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        // ==========================================
        // VALIDATE ROLE
        // ==========================================

        if (!selectedRole) {

            showMessage(
                "Please select Customer or Farmer.",
                "error"
            );

            return;
        }


        // ==========================================
        // GET REGISTER BUTTON
        // ==========================================

        const submitButton =
            registerForm.querySelector(
                'button[type="submit"]'
            );


        // Disable button
        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerText =
                "Creating Account...";
        }


        // ==========================================
        // SHOW LOADING MESSAGE
        // ==========================================

        showMessage(
            "Creating your account...",
            "loading"
        );


        try {

            console.log(
                "Sending registration request..."
            );

            console.log(
                "URL:",
                `${API_URL}/register`
            );


            // ==========================================
            // SEND REQUEST TO BACKEND
            // ==========================================

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        role: role

                    })
                }
            );


            // ==========================================
            // GET RAW RESPONSE
            // ==========================================

            const responseText =
                await response.text();


            console.log(
                "HTTP Status:",
                response.status
            );

            console.log(
                "Server Response:",
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

                data =
                    JSON.parse(responseText);

            } catch (jsonError) {

                console.error(
                    "Invalid JSON received:",
                    responseText
                );

                throw new Error(
                    "Server returned an invalid response."
                );

            }


            // ==========================================
            // HANDLE ERROR RESPONSE
            // ==========================================

            if (!response.ok) {

                showMessage(

                    data.message ||
                    "Registration failed.",

                    "error"

                );

                return;
            }


            // ==========================================
            // REGISTRATION SUCCESS
            // ==========================================

            if (
                data.success === true ||
                data.message
            ) {

                showMessage(

                    data.message ||
                    "Registration successful!",

                    "success"

                );


                console.log(
                    "Registration successful:",
                    data
                );


                // ==========================================
                // SAVE USER INFORMATION
                // ==========================================

                if (data.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );

                }


                // ==========================================
                // REDIRECT TO LOGIN
                // ==========================================

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1500);

            } else {

                showMessage(

                    "Registration failed. Please try again.",

                    "error"

                );

            }


        } catch (error) {

    console.error("=================================");
    console.error("REGISTRATION ERROR");
    console.error("=================================");

    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    showMessage(
        error.message,
        "error"
    );

}
         finally {

            // ==========================================
            // ENABLE BUTTON AGAIN
            // ==========================================

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerText =
                    "Create Account";

            }

        }

    });

}


// ==========================================
// SHOW MESSAGE FUNCTION
// ==========================================

function showMessage(message, type) {

    // Try to find existing message element
    let messageElement =
        document.getElementById(
            "message"
        );


    // If message element doesn't exist,
    // create one
    if (!messageElement) {

        messageElement =
            document.createElement("div");

        messageElement.id =
            "message";

        messageElement.style.marginTop =
            "15px";

        messageElement.style.padding =
            "12px";

        messageElement.style.borderRadius =
            "8px";

        messageElement.style.textAlign =
            "center";


        // Add before form
        if (registerForm) {

            registerForm.parentNode.insertBefore(
                messageElement,
                registerForm
            );

        } else {

            document.body.prepend(
                messageElement
            );

        }

    }


    // Set message
    messageElement.innerText =
        message;


    // Reset styles
    messageElement.style.display =
        "block";


    // Success
    if (type === "success") {

        messageElement.style.backgroundColor =
            "#d4edda";

        messageElement.style.color =
            "#155724";

        messageElement.style.border =
            "1px solid #c3e6cb";

    }


    // Error
    else if (type === "error") {

        messageElement.style.backgroundColor =
            "#f8d7da";

        messageElement.style.color =
            "#721c24";

        messageElement.style.border =
            "1px solid #f5c6cb";

    }


    // Loading
    else if (type === "loading") {

        messageElement.style.backgroundColor =
            "#e2e3e5";

        messageElement.style.color =
            "#383d41";

        messageElement.style.border =
            "1px solid #d6d8db";

    }

}