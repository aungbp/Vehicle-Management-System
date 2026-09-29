// models/rental_model.js
class RentalTransaction {
  constructor(rentalId, vehicle, customer, rentalDate, returnDate) {
    this.rentalId = rentalId;
    this.vehicle = vehicle;
    this.customer = customer;
    this.rentalDate = rentalDate;
    this.returnDate = returnDate;
    this.actualReturnDate = null;
    this.overdueDays = "-";
    this.rentalFee = this.calculateFees();
    this.status = "Ongoing";
  }

  // Create a rental transaction
  static createTransaction(vehicle, customer, rentalDate, returnDate) {
    const rentals = JSON.parse(localStorage.getItem("rentals")) || [];
    const rentalId = Date.now();
    const newTransaction = new RentalTransaction(rentalId, vehicle, customer, rentalDate, returnDate);
    rentals.push(newTransaction);
    localStorage.setItem("rentals", JSON.stringify(rentals));

    // Update vehicle availability
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.forEach(v => {
      if (v.registrationNumber === vehicle.registrationNumber) v.availability = "Not Available";
    });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    return newTransaction;
  }

  // Close a transaction (return vehicle)
  static closeTransaction(rentalId) {
    const rentals = JSON.parse(localStorage.getItem("rentals")) || [];
    const rental = rentals.find(r => r.rentalId == rentalId);
    if (!rental) return;

    const today = new Date();
    const returnDate = new Date(rental.returnDate);
    rental.actualReturnDate = today.toISOString().split("T")[0];

    // Calculate overdue and update fee
    const overdueDays = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
    rental.overdueDays = overdueDays > 0 ? overdueDays : "-";

    const vehicleRate = rental.vehicle.dailyRate || 0;
    rental.rentalFee = RentalTransaction.calculateFees(
      rental.rentalDate, rental.returnDate, vehicleRate, overdueDays
    );
    rental.status = "Returned";

    // Update vehicle availability
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.forEach(v => {
      if (v.registrationNumber === rental.vehicle.registrationNumber) v.availability = "Available";
    });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    localStorage.setItem("rentals", JSON.stringify(rentals));
  }

  // Calculate fees (always shows base fee, includes overdue when applicable)
  static calculateFees(rentalDate, returnDate, rate, overdueDays = 0) {
    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const baseFee = totalDays * rate;
    const overdueFee = overdueDays > 0 ? overdueDays * rate : 0;
    return baseFee + overdueFee;
  }
}
