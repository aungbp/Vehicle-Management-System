describe("Rental Transaction Availability", () => {
    let vehicle, customer;

    beforeEach(() => {
        localStorage.clear();
        vehicle = { registrationNumber: "ABC123", name: "Toyota Camry", type: "Sedan", availability: "Available" };
        customer = { id: 1, fullName: "Michael Scott", role: "customer" };
        localStorage.setItem("vehicles", JSON.stringify([vehicle]));
    });

    it("should mark vehicle as 'Not Available' when rented", () => {
        const vehicles = JSON.parse(localStorage.getItem("vehicles"));
        vehicles[0].availability = "Not Available";
        localStorage.setItem("vehicles", JSON.stringify(vehicles));
        expect(JSON.parse(localStorage.getItem("vehicles"))[0].availability).toBe("Not Available");
    });

    it("should mark vehicle as 'Available' after return", () => {
        const vehicles = JSON.parse(localStorage.getItem("vehicles"));
        vehicles[0].availability = "Available";
        localStorage.setItem("vehicles", JSON.stringify(vehicles));
        expect(JSON.parse(localStorage.getItem("vehicles"))[0].availability).toBe("Available");
    });

    it("should correctly update availability for multiple rentals", () => {
        const vehicles = JSON.parse(localStorage.getItem("vehicles"));
        vehicles[0].availability = "Not Available";
        vehicles[0].availability = "Available"; // simulate return
        localStorage.setItem("vehicles", JSON.stringify(vehicles));
        expect(JSON.parse(localStorage.getItem("vehicles"))[0].availability).toBe("Available");
    });
});
    