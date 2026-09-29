document.addEventListener("DOMContentLoaded", () => {
  const model = VehicleListModel;
  const view = VehicleListView;

  const searchInput = document.getElementById("vehicleSearchInput");
  const messageDiv = document.getElementById("confirmationMessage");

  // Modal elements
  const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
  const modalVehicleName = document.getElementById('modalVehicleName');
  const rentalDateInput = document.getElementById('rentalDate');
  const returnDateInput = document.getElementById('returnDate');
  const confirmBtn = document.getElementById('confirmReservationBtn');

  let selectedVehicle = null;

  // Open modal and set selected vehicle
  function handleReserve(vehicle) {
    selectedVehicle = vehicle;
    modalVehicleName.textContent = `${vehicle.make} ${vehicle.model}`;
    rentalDateInput.value = "";
    returnDateInput.value = "";
    reservationModal.show();
  }

  // Confirm reservation
  confirmBtn.addEventListener("click", () => {
    const rentalDate = rentalDateInput.value;
    const returnDate = returnDateInput.value;

    if (!rentalDate || !returnDate) {
      alert("Please select both rental and return dates.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    const loggedUser = {
      name: currentUser.fullName,
      role: currentUser.role,
      id: currentUser.id || null
    };

    // Add reservation
    ReservationModel.addReservationWithDates(selectedVehicle, loggedUser, rentalDate, returnDate);

    // Update vehicle availability
    model.updateVehicle({ ...selectedVehicle, availability: "Not Available" });

    reservationModal.hide();

    // Show confirmation message
    messageDiv.textContent = `${selectedVehicle.make} ${selectedVehicle.model} reserved from ${rentalDate} to ${returnDate}!`;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
      // Re-render vehicle list with updated availability
      view.renderVehicles(model.getVehicles(), handleReserve);
    }, 2700);
  });

  // Search functionality
  function handleSearch() {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = model.getVehicles().filter(v =>
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.type.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term)
    );
    view.renderVehicles(filtered, handleReserve);
  }

  // Initial render
  view.renderVehicles(model.getVehicles(), handleReserve);
  searchInput?.addEventListener("input", handleSearch);
});
