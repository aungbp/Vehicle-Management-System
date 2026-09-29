// main.js
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) {
  window.location.href = "login.html";
} else {
  const welcome = document.getElementById("welcomeUser");
  if(welcome) welcome.textContent = `Welcome, ${currentUser.fullName}`;
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
  logoutBtn.addEventListener("click", ()=>{
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
