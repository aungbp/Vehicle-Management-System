// view/reservation_view.js
const ReservationsView = {
  renderReservations(reservations, onActionClick) {
    const container = document.getElementById("reservationsContainer");

    if (!reservations.length) {
      container.innerHTML = `<p class="text-center text-muted">No reservations yet.</p>`;
      return;
    }

    let tableHTML = `
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Customer</th>
            <th>Reservation Date</th>
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    reservations.forEach((r, index) => {
      tableHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${r.vehicle.make} ${r.vehicle.model}</td>
          <td>${r.user.name}</td>
          <td>${r.date}</td>
          <td>${r.rentalDate || "-"}</td>
          <td>${r.returnDate || "-"}</td>
          <td>${r.status}</td>
          <td>
            ${r.hideActions ? '' : `
              <button class="btn btn-sm btn-warning me-1" data-index="${index}" data-action="accept">Accept</button>
              <button class="btn btn-danger btn-sm" data-index="${index}" data-action="deny">Deny</button>
            `}
          </td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;

    container.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;
        onActionClick(index, action);
      });
    });
  }
};
