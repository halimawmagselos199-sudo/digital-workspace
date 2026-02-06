const employees = [
    { username: "admin", password: "admin123" },
    { username: "juan", password: "juan123" },
    { username: "eve", password: "eve123" }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const employee = employees.find(
        user => user.username === username && user.password === password
    );

    if (employee) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
    } else {
        message.textContent = "Invalid username or password";
    }
});