class LoginModel {
  // Return a unified users array from localStorage
  getUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Backward-compat: merge any old "customers"/"staff" arrays if present (only if "users" empty)
    const legacyCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const legacyStaff = JSON.parse(localStorage.getItem("staff")) || [];
    if ((legacyCustomers.length || legacyStaff.length) && users.length === 0) {
      const merged = [...legacyCustomers, ...legacyStaff];
      localStorage.setItem("users", JSON.stringify(merged));
      return merged;
    }

    return users;
  }
}
