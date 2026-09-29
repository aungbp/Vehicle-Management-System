// controller/reservation_controller.js
document.addEventListener("DOMContentLoaded", () => {
  const model = ReservationModel;
  const view = ReservationsView;

  function handleAction(index, action) {
    const reservations = model.getReservations();
    const reservation = reservations[index];
    if (!reservation) return;

    if (action === "accept") {
      model.updateReservationStatus(reservation.id, "Accepted");

      // --- Create rental record when a reservation is accepted ---
      const rentals = JSON.parse(localStorage.getItem("rentals")) || [];

      // Normalize customer info so it matches currentUser structure
      const customerObj = {
        userId: reservation.user?.userId || reservation.userId || reservation.customerId || null,
        fullName: reservation.user?.fullName || reservation.fullName || "Unknown",
        email: reservation.user?.email || reservation.email || "",
        phone: reservation.user?.phone || reservation.phone || "",
        address: reservation.user?.address || reservation.address || "",
        customerType: reservation.user?.customerType || reservation.customerType || "",
        activeStatus: reservation.user?.activeStatus || reservation.activeStatus || "",
        role: "customer"
      };

      // Calculate base rental fee (days * vehicle rate)
      const start = new Date(reservation.rentalDate);
      const end = new Date(reservation.returnDate);
      const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      const baseFee = (reservation.vehicle.dailyRate || 0) * totalDays;

      const newRental = {
        rentalId: Date.now(),
        vehicle: reservation.vehicle,
        customer: customerObj, // ✅ store full customer details
        rentalDate: reservation.rentalDate,
        returnDate: reservation.returnDate,
        actualReturnDate: null,
        overdueDays: "-",
        rentalFee: baseFee,
        status: "Ongoing"
      };

      rentals.push(newRental);
      localStorage.setItem("rentals", JSON.stringify(rentals));

      // Update vehicle availability
      updateVehicleAvailability(reservation.vehicle.registrationNumber, "Not Available");
    } 
    
    else if (action === "deny") {
      const confirmDeny = confirm("Are you sure you want to deny this reservation?");
      if (!confirmDeny) return;

      const updatedReservations = reservations.filter(r => r.id !== reservation.id);
      model.saveReservations(updatedReservations);
      updateVehicleAvailability(reservation.vehicle.registrationNumber, "Available");
    }

    renderReservations();
  }

  function updateVehicleAvailability(regNumber, availability) {
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    const updatedVehicles = vehicles.map(v => {
      if (v.registrationNumber === regNumber) v.availability = availability;
      return v;
    });
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
  }

  function renderReservations() {
    const reservations = model.getReservations();
    const modifiedReservations = reservations.map(r => ({
      ...r,
      hideActions: r.status === "Accepted" || r.status === "Denied"
    }));
    view.renderReservations(modifiedReservations, handleAction);
  }

  renderReservations();
});
