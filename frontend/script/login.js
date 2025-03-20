// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const formContents = document.querySelectorAll('.form-content');
const toggleTabs = document.querySelectorAll('.toggle-tab');

function switchToTab(tabId) {
    // Update active tab
    tabs.forEach(t => {
        t.classList.remove('active');
        if (t.getAttribute('data-tab') === tabId) {
            t.classList.add('active');
        }
    });

    // Show corresponding form
    formContents.forEach(form => {
        form.classList.remove('active');
        if (form.id === tabId) {
            form.classList.add('active');
        }
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchToTab(tabId);
    });
});

// Handle toggle links (e.g., "Sign up" link in login form)
toggleTabs.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        switchToTab(tabId);
    });
});

async function userSignup() {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": name,
        "email": email,
        "password": password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://mealmaster-app-1.onrender.com/users/register", requestOptions);
        const result = await response.text();
        console.log(result);

        if (response.ok) {
            alert("Signup successful! Please log in.");
            switchToTab("login"); // Activate the login form after signup
        } else {
            alert("Signup failed! Try again.");
        }
    } catch (error) {
        alert(error.message);
    }
}

async function userLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "password": password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://mealmaster-app-1.onrender.com/users/login", requestOptions);
        const result = await response.text();
        console.log(result);

        if (response.ok) {
            localStorage.setItem("isLoggedin", "true");
            window.location.href = '../index.html';
        } else {
            alert("Invalid email or password");
            document.getElementById("login-email").value = "";
            document.getElementById("login-password").value = "";
        }
    } catch (error) {
        alert(error.message);
    }
}