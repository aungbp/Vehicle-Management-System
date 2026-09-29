// controller/login_controller.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const model = new LoginModel();
  const message = document.getElementById("loginMessage");
  const showPassword = document.getElementById("showPassword");
  const passwordInput = document.getElementById("password");

  // If already logged in, redirect correctly
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (currentUser) {
    redirectByRole(currentUser.role);
    return;
  }

  // Toggle password visibility
  showPassword.addEventListener("change", () => {
    passwordInput.type = showPassword.checked ? "text" : "password";
  });

  // Handle login
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const userId = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const allUsers = model.getUsers();

    // Match by fullName OR email (case-insensitive)
    const user = allUsers.find(u =>
      ((u.fullName && u.fullName.toLowerCase() === userId.toLowerCase()) ||
       (u.email && u.email.toLowerCase() === userId.toLowerCase()))
    );

    if (user && user.password === password) {
      // 🚫 Block inactive customers
      if (user.role === "customer" && user.activeStatus === "Inactive") {
        message.textContent = "Your account is inactive. Please contact support.";
        message.style.display = "block";
        return;
      }

      // Save user and redirect
      localStorage.setItem("currentUser", JSON.stringify(user));
      redirectByRole(user.role);
    } else {
      message.textContent = "Invalid username/email or password.";
      message.style.display = "block";
    }
  });

  // --- Helper: redirect by role ---
  function redirectByRole(role) {
    const basePath = window.location.origin + window.location.pathname;
    if (role === "staff") {
      // Always send staff to the root index
      window.location.href = "../index.html";
    } else if (role === "customer") {
      // Always send customer to the vehicle search page
      window.location.href = "./vehicle_list.html";
    } else {
      window.location.href = "./login.html";
    }
  }
});
