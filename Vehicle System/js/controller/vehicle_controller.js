document.addEventListener("DOMContentLoaded", () => {
  const view = new VehicleView();
  const vehicleForm = document.getElementById("vehicleForm");
  const searchInput = document.getElementById("searchVehicleInput");
  const availabilityInput = document.getElementById("availability");
  const statusInput = document.getElementById("status");

  let editId = null; // Track which vehicle is being edited

  function refreshTable(vehiclesToRender = Vehicle.getVehicles()) {
    view.renderVehicles(vehiclesToRender);
  }

  function handleAdd(e) {
    e.preventDefault();

    // Gather vehicle data from form
    const vehicleData = {
      make: document.getElementById("make").value.trim(),
      model: document.getElementById("model").value.trim(),
      year: parseInt(document.getElementById("year").value),
      registrationNumber: document.getElementById("registrationNumber").value.trim(),
      type: document.getElementById("type").value.trim(),
      dailyRate: parseFloat(document.getElementById("dailyRate").value),
      mileage: parseFloat(document.getElementById("mileage").value),
      availability: availabilityInput.value,
      location: document.getElementById("location").value.trim(),
      status: statusInput.value.trim() // keep whatever the user types
    };

    // Add or update vehicle
    if (editId !== null) {
      vehicleData.id = editId;
      Vehicle.updateVehicle(vehicleData);
      editId = null;
    } else {
      Vehicle.addVehicle(vehicleData);
    }

    vehicleForm.reset();
    refreshTable();
  }

  // Handle Edit
  view.onEdit = (vehicle) => {
    editId = vehicle.id;
    document.getElementById("make").value = vehicle.make;
    document.getElementById("model").value = vehicle.model;
    document.getElementById("year").value = vehicle.year;
    document.getElementById("registrationNumber").value = vehicle.registrationNumber;
    document.getElementById("type").value = vehicle.type;
    document.getElementById("dailyRate").value = vehicle.dailyRate;
    document.getElementById("mileage").value = vehicle.mileage;
    availabilityInput.value = vehicle.availability;
    document.getElementById("location").value = vehicle.location;
    statusInput.value = vehicle.status;
  };

  // Handle Delete
  view.onDelete = (id) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      Vehicle.deleteVehicle(id);
      if (editId === id) editId = null;
      refreshTable();
    }
  };

  // Search Vehicles
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const filtered = Vehicle.getVehicles().filter(v =>
        v.make.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        v.registrationNumber.toLowerCase().includes(term)
      );
      refreshTable(filtered);
    });
  }

  // Bind form submit
  vehicleForm.addEventListener("submit", handleAdd);

  // Initial render
  refreshTable();
});
