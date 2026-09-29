// model/vehicle_list_model.js

const VehicleListModel = {
  /**
   * Retrieve all vehicles from localStorage
   */
  getVehicles() {
    return JSON.parse(localStorage.getItem("vehicles")) || [];
  },

  /**
   * Save the full vehicle list back into localStorage
   */
  saveVehicles(vehicles) {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  },

  /**
   * Update a vehicle's availability when rented*/
  updateVehicle(vehicleToUpdate) {
    let vehicles = this.getVehicles();

    vehicles = vehicles.map(v => {
      if (v.registrationNumber === vehicleToUpdate.registrationNumber) {
        v.availability = "Not Available";
        // Leave v.status unchanged
      }
      return v;
    });

    this.saveVehicles(vehicles);
    return vehicles;
  }
};
