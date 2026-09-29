// MODEL
class Vehicle {
  // Get vehicles from localStorage or initialize empty array
  static getVehicles() {
    return JSON.parse(localStorage.getItem("vehicles")) || [];
  }

  // Save vehicles array to localStorage
  static saveVehicles(vehicles) {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }

  // Reassign sequential IDs starting from 1
  static reassignIds(vehicles) {
    vehicles.forEach((v, index) => v.id = index + 1);
    return vehicles;
  }

  // Add new vehicle
  static addVehicle(vehicle) {
    const vehicles = this.getVehicles();
    vehicles.push(vehicle);
    const updatedVehicles = this.reassignIds(vehicles);
    this.saveVehicles(updatedVehicles);
  }

  // Update vehicle
  static updateVehicle(updatedVehicle) {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === updatedVehicle.id);
    if (index !== -1) {
      vehicles[index] = updatedVehicle;
      this.saveVehicles(vehicles);
    }
  }

  // Delete vehicle
  static deleteVehicle(id) {
    let vehicles = this.getVehicles();
    vehicles = vehicles.filter(v => v.id !== id);
    vehicles = this.reassignIds(vehicles);
    this.saveVehicles(vehicles);
  }
}
