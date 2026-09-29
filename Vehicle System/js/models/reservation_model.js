class Reservation {
  constructor(id, vehicle, user, date, status = "Pending") {
    this.id = id;
    this.vehicle = vehicle;
    this.user = user;
    this.date = date;
    this.status = status;
    this.rentalDate = null;
    this.returnDate = null;
  }
}

const ReservationModel = {
  getReservations() {
    let data = JSON.parse(localStorage.getItem("reservations")) || [];
    data = data.map((r, index) => ({ ...r, id: index + 1 }));
    localStorage.setItem("reservations", JSON.stringify(data));
    return data.map(r => Object.assign(new Reservation(r.id, r.vehicle, r.user, r.date, r.status), {
      rentalDate: r.rentalDate,
      returnDate: r.returnDate
    }));
  },

  saveReservations(reservations) {
    const sequenced = reservations.map((r, index) => ({ ...r, id: index + 1 }));
    localStorage.setItem("reservations", JSON.stringify(sequenced));
  },

  addReservation(vehicle, user) {
    const reservations = this.getReservations();
    const newId = reservations.length ? reservations[reservations.length - 1].id + 1 : 1;
    const currentDate = new Date().toLocaleDateString();
    const reservation = new Reservation(newId, vehicle, user, currentDate, "Pending");
    reservations.push(reservation);
    this.saveReservations(reservations);
  },

  addReservationWithDates(vehicle, user, rentalDate, returnDate) {
    const reservations = this.getReservations();
    const newId = reservations.length ? reservations[reservations.length - 1].id + 1 : 1;
    const reservation = new Reservation(newId, vehicle, user, new Date().toLocaleDateString(), "Pending");
    reservation.rentalDate = rentalDate;
    reservation.returnDate = returnDate;
    reservations.push(reservation);
    this.saveReservations(reservations);
  },

  updateReservationStatus(id, status) {
    const reservations = this.getReservations();
    reservations.forEach(r => { if (r.id == id) r.status = status; });
    this.saveReservations(reservations);
  }
};
