// view/vehicle_list_view.js

const VehicleListView = {
  /**
   * Render vehicle cards in the Vehicle List page
   * @param {Array} vehicles - list of vehicle objects
   * @param {Function} onReserveClick - callback when Reserve button is clicked
   */
  renderVehicles(vehicles, onReserveClick) {
    const vehicleContainer = document.getElementById("vehicleContainer");
    vehicleContainer.innerHTML = "";

    if (!vehicles.length) {
      vehicleContainer.innerHTML = `
        <div class="col-12 text-center text-muted">
          <p>No vehicles match your search.</p>
        </div>`;
      return;
    }

    // Only show vehicles that are available
    const availableVehicles = vehicles.filter(v => v.availability !== "Not Available");

    availableVehicles.forEach(vehicle => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      let statusClass = "status-Other";
      if (vehicle.status === "Available") statusClass = "status-Available";
      else if (vehicle.status === "Not Available") statusClass = "status-NotAvailable";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="https://images.unsplash.com/photo-1501066927591-314112b5888e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800"
               class="card-img-top" alt="${vehicle.make} ${vehicle.model}">
          <div class="card-body text-center">
            <h5 class="card-title">${vehicle.make} ${vehicle.model}</h5>
            <p class="mb-1"><strong>Type:</strong> ${vehicle.type}</p>
            <p class="mb-1"><strong>Location:</strong> ${vehicle.location}</p>
            <p class="status-line ${statusClass}">${vehicle.status}</p>
            <p class="rate-line fw-semibold text-dark">$${vehicle.dailyRate}/day</p>
            <button class="btn btn-primary btn-reserve w-100">Reserve</button>
          </div>
        </div>
      `;

      // Attach click event to Reserve button
      const reserveBtn = col.querySelector(".btn-reserve");
      reserveBtn.addEventListener("click", () => onReserveClick(vehicle));

      vehicleContainer.appendChild(col);
    });
  }
};
