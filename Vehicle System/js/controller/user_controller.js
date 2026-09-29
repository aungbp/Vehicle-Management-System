document.addEventListener("DOMContentLoaded", () => {
  const model = new UserModel();
  const view = new UserView();
  let editIndex = null; // store ARRAY INDEX, not userId

  function attachStorageIndex() {
    return model.getAllUsers().map((u, i) => ({ ...u, _storageIndex: i }));
  }

  function refreshTable(filteredUsers = null) {
    const allWithIndex = attachStorageIndex();
    let toRender;

    if (Array.isArray(filteredUsers)) {
      const mapKey = u => (u.email || "") + "||" + (u.fullName || "");
      const storedMap = new Map(allWithIndex.map(u => [mapKey(u), u]));
      toRender = filteredUsers.map(f => storedMap.get(mapKey(f))).filter(Boolean);
    } else {
      toRender = allWithIndex;
    }

    view.renderTables(toRender, handleEdit, handleDelete);
  }

  const todayISO = () => new Date().toISOString().split("T")[0];

  function handleAdd(e) {
    e.preventDefault();
    if (!view.validateForm()) return;

    const form = view.getFormData();

    if (editIndex !== null) {
      const existing = model.getAllUsers()[editIndex];
      if (!form.password) form.password = existing.password;
      if (form.role === "customer" && !form.registrationDate) {
        form.registrationDate = existing.registrationDate || todayISO();
      }
      model.updateUser(editIndex, form);
      editIndex = null;
      view.submitBtn.textContent = "Add User";
    } else {
      model.addUser(form);
    }

    view.clearForm();
    refreshTable();
  }

  function handleEdit(userId) {
    const idx = model.getAllUsers().findIndex(u => u.userId === userId);
    if (idx === -1) return;
    const user = model.getAllUsers()[idx];

    view.nameInput.value = user.fullName || "";
    view.emailInput.value = user.email || "";
    view.phoneInput.value = user.phone || "";
    view.passwordInput.value = user.password || "";
    view.userRole.value = user.role || "";

    if (user.role === "customer") {
      view.customerAddressDiv.classList.remove("d-none");
      view.customerTypeDiv.classList.remove("d-none");
      view.customerStatusDiv.classList.remove("d-none");
      view.staffRoleDiv.classList.add("d-none");
      view.customerAddressInput.value = user.address || "";
      view.customerTypeInput.value = user.customerType || "";
      view.customerStatusInput.value = user.activeStatus || "Active";
    } else if (user.role === "staff") {
      view.staffRoleDiv.classList.remove("d-none");
      view.customerAddressDiv.classList.add("d-none");
      view.customerTypeDiv.classList.add("d-none");
      view.customerStatusDiv.classList.add("d-none");
      view.staffRoleInput.value = user.staffRole || "";
    } else {
      view.customerAddressDiv.classList.add("d-none");
      view.customerTypeDiv.classList.add("d-none");
      view.customerStatusDiv.classList.add("d-none");
      view.staffRoleDiv.classList.add("d-none");
    }

    editIndex = idx; // store INDEX
    view.submitBtn.textContent = "Update";
  }

  function handleDelete(userId) {
    const idx = model.getAllUsers().findIndex(u => u.userId === userId);
    if (idx !== -1) {
      model.deleteUser(idx);
      if (editIndex === idx) editIndex = null;
      refreshTable();
    }
  }

  function handleSearch() {
    const term = view.searchInput ? view.searchInput.value.trim() : "";
    if (!term) { refreshTable(); return; }
    const results = model.searchUsers(term);
    refreshTable(results);
  }

  view.userRole.addEventListener("change", () => {
    if (view.userRole.value === "customer") {
      view.customerAddressDiv.classList.remove("d-none");
      view.customerTypeDiv.classList.remove("d-none");
      view.customerStatusDiv.classList.remove("d-none");
      view.staffRoleDiv.classList.add("d-none");
    } else if (view.userRole.value === "staff") {
      view.staffRoleDiv.classList.remove("d-none");
      view.customerAddressDiv.classList.add("d-none");
      view.customerTypeDiv.classList.add("d-none");
      view.customerStatusDiv.classList.add("d-none");
    } else {
      view.customerAddressDiv.classList.add("d-none");
      view.customerTypeDiv.classList.add("d-none");
      view.customerStatusDiv.classList.add("d-none");
      view.staffRoleDiv.classList.add("d-none");
    }
  });

  view.form.addEventListener("submit", handleAdd);
  if (view.searchInput) view.searchInput.addEventListener("input", handleSearch);

  refreshTable();
});