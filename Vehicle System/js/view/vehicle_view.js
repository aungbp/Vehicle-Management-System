// VIEW
class VehicleView {
  constructor() {
    this.vehicleTable = document.getElementById("vehicleTable");
  }

  renderVehicles(vehicles) {
    this.vehicleTable.innerHTML = "";

    vehicles.forEach(vehicle => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${vehicle.id}</td>
        <td>${vehicle.make}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.year}</td>
        <td>${vehicle.registrationNumber}</td>
        <td>${vehicle.type}</td>
        <td>${vehicle.dailyRate}</td>
        <td>${vehicle.mileage}</td>
        <td>${vehicle.availability}</td>
        <td>${vehicle.location}</td>
        <td>${vehicle.status}</td>
        <td class="text-center sticky-action">
          <button class="btn btn-sm btn-warning me-1 edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </td>
      `;

      // Edit button
      tr.querySelector(".edit-btn").addEventListener("click", () => {
        if (typeof this.onEdit === "function") this.onEdit(vehicle);
      });

      // Delete button
      tr.querySelector(".delete-btn").addEventListener("click", () => {
        if (typeof this.onDelete === "function") this.onDelete(vehicle.id);
      });

      this.vehicleTable.appendChild(tr);
    });
  }
}
