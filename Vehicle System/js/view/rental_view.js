// view/rental_view.js
const RentalView = {
  renderRentals(rentals, onReturnClick, currentUser) {
    const container = document.getElementById("rentalContainer");

    if (!rentals || rentals.length === 0) {
      container.innerHTML = `<p class="text-center text-muted mt-3">No rental records found.</p>`;
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
            <th>Rental Fee ($)</th>
            <th>Status</th>
            ${currentUser?.role === "staff" ? "<th>Action</th>" : ""}
          </tr>
        </thead>
        <tbody>
    `;

    rentals.forEach(r => {
      const customerName = r.customer?.fullName || r.customer?.name || "Unknown";
      html += `
        <tr>
          <td>${r.rentalId}</td>
          <td>${r.vehicle.make} ${r.vehicle.model}</td>
          ${currentUser?.role === "staff" ? `<td>${customerName}</td>` : ""}
          <td>${r.rentalDate}</td>
          <td>${r.returnDate}</td>
          <td>${r.actualReturnDate || "-"}</td>
          <td>${r.overdueDays > 0 ? r.overdueDays : "-"}</td>
          <td>${r.rentalFee}</td>
          <td>${r.status}</td>
          ${
            currentUser?.role === "staff" && r.status === "Ongoing"
              ? `<td><button class="btn btn-success btn-sm" data-id="${r.rentalId}">Return</button></td>`
              : currentUser?.role === "staff" ? `<td>-</td>` : ""
          }
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    // Add Return button listeners for staff
    if (currentUser?.role === "staff") {
      container.querySelectorAll("button[data-id]").forEach(btn => {
        btn.addEventListener("click", () => onReturnClick(btn.dataset.id));
      });
    }
  }
};
