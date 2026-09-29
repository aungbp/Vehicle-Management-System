// js/controller/rental_controller.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("rentalContainer");
  const searchInput = document.getElementById("rentalSearchInput");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let allRentals = JSON.parse(localStorage.getItem("rentals")) || [];

  const ONE_DAY = 24 * 60 * 60 * 1000;

  // ---------- ASSIGN SEQUENTIAL IDs ----------
  function assignSequentialIds() {
    allRentals = allRentals.map((r, index) => ({ ...r, rentalId: index + 1 }));
    localStorage.setItem("rentals", JSON.stringify(allRentals));
  }
  assignSequentialIds();
  let rentals = allRentals;

  // ---------- DATE HELPERS ----------
  function parseYMD(ymd) {
    if (!ymd) return null;
    const [y, m, d] = String(ymd).split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setHours(12, 0, 0, 0);
    return dt;
  }

  function daysBetween(startYMD, endYMD) {
    const a = parseYMD(startYMD);
    const b = parseYMD(endYMD);
    if (!a || !b) return 0;
    return Math.max(0, Math.round((b - a) / ONE_DAY));
  }

  function calcBaseDays(r) {
    return Math.max(1, daysBetween(r.rentalDate, r.returnDate));
  }

  function calcOverdueDays(r) {
    if (!r.actualReturnDate) return 0;
    return Math.max(0, daysBetween(r.returnDate, r.actualReturnDate));
  }

  // ---------- RENDER FUNCTION ----------
  function render(filtered = rentals) {
    if (!filtered.length) {
      container.innerHTML = `<p class="text-center text-muted mt-4">No rental records found.</p>`;
      return;
    }

    let html = `
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            ${currentUser?.role === "staff" ? "<th>Customer</th>" : ""}
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Actual Return</th>
            <th>Overdue Days</th>
            <th>Rental Fee</th>
            <th>Status</th>
            ${currentUser?.role === "staff" ? "<th>Action</th>" : ""}
          </tr>
        </thead>
        <tbody>
    `;

    filtered.forEach(r => {
      const v = r.vehicle || {};
      const rate = Number(v.dailyRate || 0);
      const baseDays = calcBaseDays(r);
      const overdueDays = calcOverdueDays(r);
      const fee = (baseDays + overdueDays) * rate;

      const customerName = r.customer?.fullName || r.customer?.name || "Unknown";

      html += `
        <tr>
          <td>${r.rentalId}</td>
          <td>${v.make || "-"} ${v.model || ""}</td>
          ${currentUser?.role === "staff" ? `<td>${customerName}</td>` : ""}
          <td>${r.rentalDate || "-"}</td>
          <td>${r.returnDate || "-"}</td>
          <td>${r.actualReturnDate || "-"}</td>
          <td>${overdueDays > 0 ? overdueDays : "-"}</td>
          <td>$${fee.toFixed(2)}</td>
          <td>
            <span class="badge ${r.status === "Returned" ? "badge-returned" : "badge-ongoing"}">
              ${r.status || "-"}
            </span>
          </td>
          ${
            currentUser?.role === "staff" && r.status === "Ongoing"
              ? `<td><button class="btn btn-add btn-sm returnBtn" data-id="${r.rentalId}">Return</button></td>`
              : currentUser?.role === "staff" ? `<td>-</td>` : ""
          }
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    // Staff return button logic
    if (currentUser?.role === "staff") {
      container.querySelectorAll(".returnBtn").forEach(btn =>
        btn.addEventListener("click", () => handleReturn(btn.dataset.id))
      );
    }
  }

  // ---------- RETURN HANDLER (STAFF ONLY) ----------
  function handleReturn(rentalId) {
    const idx = allRentals.findIndex(r => r.rentalId == rentalId);
    if (idx === -1) return;

    const rental = allRentals[idx];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const todayYMD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    rental.actualReturnDate = todayYMD;

    const baseDays = calcBaseDays(rental);
    const overdueDays = calcOverdueDays(rental);
    const rate = Number(rental.vehicle?.dailyRate || 0);
    rental.overdueDays = overdueDays > 0 ? overdueDays : 0;
    rental.rentalFee = (baseDays + overdueDays) * rate;
    rental.status = "Returned";

    // Update vehicle availability
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.forEach(v => {
      if (v.registrationNumber === rental.vehicle?.registrationNumber) {
        v.availability = "Available";
      }
    });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    // Save updated rentals
    allRentals[idx] = rental;
    localStorage.setItem("rentals", JSON.stringify(allRentals));

    // Refresh rentals for staff
    rentals = allRentals;
    render();
  }

  // ---------- SEARCH (STAFF ONLY) ----------
  if (currentUser?.role === "staff") {
    searchInput?.addEventListener("input", () => {
      const term = (searchInput.value || "").trim().toLowerCase();
      if (!term) return render();

      const filtered = rentals.filter(r =>
        (r.rentalDate && r.rentalDate.toLowerCase().includes(term)) ||
        (r.returnDate && r.returnDate.toLowerCase().includes(term)) ||
        (r.status && r.status.toLowerCase().includes(term)) ||
        (r.vehicle?.make && r.vehicle.make.toLowerCase().includes(term)) ||
        (r.vehicle?.model && r.vehicle.model.toLowerCase().includes(term))
      );
      render(filtered);
    });
  }

  render();
});
