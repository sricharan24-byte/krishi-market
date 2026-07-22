document.addEventListener('DOMContentLoaded', () => {
 const registerForm = document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();


    // Get form values

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;


    // Get selected role

    const selectedRole =
        document.querySelector(
            'input[name="role"]:checked'
        );


    // Validate role

    if (!selectedRole) {

        showMessage(
            "Please select whether you want to buy or sell products.",
            "error"
        );

        return;

    }


    const role = selectedRole.value;


    // Validate password

    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;

    }


    // Validate terms

    if (!terms) {

        showMessage(
            "Please accept the Terms & Conditions.",
            "error"
        );

        return;

    }


    // Create user object

    const user = {

        fullName: fullName,

        email: email,

        phone: phone,

        password: password,

        role: role

    };


    /*
    ------------------------------------------------
    TEMPORARY FRONTEND STORAGE
    ------------------------------------------------

    This is only for frontend testing.

    Later, when we build the backend,
    this will be replaced with a fetch()
    request to the Node.js API.
    */


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    // Check if email already exists

    const existingUser =
        users.find(
            existingUser =>
                existingUser.email === email
        );


    if (existingUser) {

        showMessage(
            "An account with this email already exists.",
            "error"
        );

        return;

    }


    // Add new user

    users.push(user);


    // Save users

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // Show success message

    showMessage(
        "Account created successfully! Redirecting to login...",
        "success"
    );


    /*
    ------------------------------------------------
    REDIRECT TO LOGIN PAGE
    ------------------------------------------------

    Wait 2 seconds so the user can
    see the success message.
    */

    setTimeout(function() {

        window.location.href =
            "login.html";

    }, 2000);

});


// ==================================================
// SHOW MESSAGE FUNCTION
// ==================================================

function showMessage(message, type) {

    registerMessage.textContent =
        message;

    registerMessage.className =
        type;

}
});