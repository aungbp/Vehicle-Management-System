// view/user_view.js

class UserView {
  constructor() {
    this.form = document.getElementById("userForm");
    this.nameInput = document.getElementById("userName");
    this.emailInput = document.getElementById("userEmail");
    this.phoneInput = document.getElementById("userPhone");
    this.passwordInput = document.getElementById("userPassword");
    this.searchInput = document.getElementById("searchInput");
    this.userRole = document.getElementById("userRole");

    this.customerAddressDiv = document.getElementById("customerAddressDiv");
    this.customerTypeDiv = document.getElementById("customerTypeDiv");
    this.customerStatusDiv = document.getElementById("customerStatusDiv");
    this.staffRoleDiv = document.getElementById("staffRoleDiv");

    this.customerAddressInput = document.getElementById("customerAddress");
    this.customerTypeInput = document.getElementById("customerType");
    this.customerStatusInput = document.getElementById("customerStatus");
    this.staffRoleInput = document.getElementById("staffRole");

    this.customerTableBody = document.getElementById("customerTable");
    this.staffTableBody = document.getElementById("staffTable");
    this.submitBtn = document.getElementById("submitBtn");

    // --- Inline error elements ---
    this.phoneError = document.createElement("div");
    this.phoneError.classList.add("text-danger", "mt-1", "small");
    this.phoneError.style.display = "none";
    this.phoneInput.insertAdjacentElement("afterend", this.phoneError);

    this.emailError = document.createElement("div");
    this.emailError.classList.add("text-danger", "mt-1", "small");
    this.emailError.style.display = "none";
    this.emailInput.insertAdjacentElement("afterend", this.emailError);
  }

  getFormData() {
    return {
      fullName: this.capitalizeName(this.nameInput.value.trim()),
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      password: this.passwordInput.value,
      role: this.userRole.value,
      address: this.userRole.value === "customer" ? this.customerAddressInput.value.trim() : "",
      customerType: this.userRole.value === "customer" ? this.customerTypeInput.value.trim() : "",
      activeStatus: this.userRole.value === "customer" ? this.customerStatusInput.value : "",
      staffRole: this.userRole.value === "staff" ? this.staffRoleInput.value.trim() : "",
      registrationDate: undefined
    };
  }

  clearForm() {
    this.form.reset();
    this.hideExtraFields();
    this.phoneError.style.display = "none";
    this.emailError.style.display = "none";
    this.submitBtn.textContent = "Add User";
  }

  hideExtraFields() {
    this.customerAddressDiv.classList.add("d-none");
    this.customerTypeDiv.classList.add("d-none");
    this.customerStatusDiv.classList.add("d-none");
    this.staffRoleDiv.classList.add("d-none");
  }

  validateForm() {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    // --- Email validation ---
    if (!emailPattern.test(this.emailInput.value.trim())) {
      this.emailError.textContent = "Please enter a valid email address (e.g. name@example.com).";
      this.emailError.style.display = "block";
      valid = false;
    } else {
      this.emailError.style.display = "none";
    }

    // --- Phone validation ---
    if (!phonePattern.test(this.phoneInput.value.trim())) {
      this.phoneError.textContent = "Phone number must be exactly 10 digits.";
      this.phoneError.style.display = "block";
      valid = false;
    } else {
      this.phoneError.style.display = "none";
    }

    // --- Basic required field checks ---
    if (!this.nameInput.value.trim()) valid = false;
    if (!this.passwordInput.value.trim()) valid = false;
    if (!this.userRole.value) valid = false;

    return valid;
  }

  //  Capitalize each word in name
  capitalizeName(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  renderTables(users, onEdit, onDelete) {
    this.customerTableBody.innerHTML = "";
    this.staffTableBody.innerHTML = "";

    const customers = users.filter(u => u.role === "customer");
    const staff = users.filter(u => u.role === "staff");

    customers.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.userId}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address || ""}</td>
        <td>${user.customerType || ""}</td>
        <td>${user.activeStatus || ""}</td>
        <td>${user.registrationDate || ""}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2 edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </td>`;
      const [editBtn, deleteBtn] = row.querySelectorAll("button");
      editBtn.addEventListener("click", () => onEdit(user.userId));
      deleteBtn.addEventListener("click", () => onDelete(user.userId));
      this.customerTableBody.appendChild(row);
    });

    staff.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.userId}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.staffRole || ""}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2 edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </td>`;
      const [editBtn, deleteBtn] = row.querySelectorAll("button");
      editBtn.addEventListener("click", () => onEdit(user.userId));
      deleteBtn.addEventListener("click", () => onDelete(user.userId));
      this.staffTableBody.appendChild(row);
    });
  }
}
