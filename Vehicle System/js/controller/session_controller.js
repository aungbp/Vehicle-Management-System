// controller/session_controller.js
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameDisplay = document.getElementById("loggedUserName");

  if (currentUser) {
    if (userNameDisplay) {
      userNameDisplay.textContent = `Welcome, ${currentUser.fullName} (${capitalize(currentUser.role)})`;
    }

    // Hide staff-only pages for customers, but keep Rentals and Vehicle Search
    if (currentUser.role === "customer") {
      const navLinks = document.querySelectorAll(".navbar-nav .nav-item a");
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (
          href.includes("index.html") || 
          href.includes("vehicles.html") || 
          href.includes("reservation.html")
        ) {
          link.parentElement.style.display = "none";
        }
      });
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");

      //  Works from any folder (root or /views/)
      const currentPath = window.location.pathname;
      let targetPath = "";

      if (currentPath.includes("/views/")) {
        targetPath = "login.html";
      } else {
        targetPath = "views/login.html";
      }

      window.location.href = targetPath;
    });
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
});
