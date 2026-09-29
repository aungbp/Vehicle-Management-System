class User {
  constructor(userId, fullName, email, phone, password, role) {
    this.userId = userId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role; // "customer" | "staff"
  }
}

class Customer extends User {
  constructor(userId, fullName, email, phone, password, address, customerType, registrationDate, activeStatus) {
    super(userId, fullName, email, phone, password, "customer");
    this.address = address || "";
    this.customerType = customerType || "";
    this.registrationDate = registrationDate || new Date().toISOString().split("T")[0];
    this.activeStatus = activeStatus || "Active";
  }
}

class Staff extends User {
  constructor(userId, fullName, email, phone, password, staffRole) {
    super(userId, fullName, email, phone, password, "staff");
    this.staffRole = staffRole || "";
  }
}

class UserModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  //  Removed auto-reassignment of IDs to preserve existing ones
  getAllUsers() {
    return this.users;
  }

  //  Generate new ID safely (max + 1)
  getNextId() {
    if (this.users.length === 0) return 1;
    return Math.max(...this.users.map(u => u.userId || 0)) + 1;
  }

  addUser(user) {
    const payload = { ...user };
    if (!payload.userId) payload.userId = this.getNextId();

    if (payload.role === "customer" && !payload.registrationDate) {
      payload.registrationDate = new Date().toISOString().split("T")[0];
    }

    this.users.push(payload);
    this.saveToLocalStorage();
  }

  updateUser(index, updatedUser) {
    // Preserve existing ID
    updatedUser.userId = this.users[index].userId;
    this.users[index] = { ...updatedUser };
    this.saveToLocalStorage();
  }

  deleteUser(index) {
    this.users.splice(index, 1);
    this.saveToLocalStorage();
  }

  searchUsers(term) {
    if (!term) return this.users;
    const t = term.toLowerCase();
    return this.users.filter(u =>
      (u.fullName && u.fullName.toLowerCase().includes(t)) ||
      (u.email && u.email.toLowerCase().includes(t))
    );
  }
}
