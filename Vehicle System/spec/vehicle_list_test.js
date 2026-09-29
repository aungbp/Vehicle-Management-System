describe("Vehicle List Management", () => {

    describe("Vehicle Search by Type, Make, and Location", () => {
        let vehicles;

        beforeEach(() => {
            localStorage.clear();

            vehicles = [
                { registrationNumber: "ABC123", name: "Toyota Camry", type: "Sedan", location: "Scranton", availability: "Available" },
                { registrationNumber: "DEF456", name: "Honda Civic", type: "Sedan", location: "Scranton", availability: "Available" },
                { registrationNumber: "GHI789", name: "Ford F-150", type: "Truck", location: "New York", availability: "Available" }
            ];

            localStorage.setItem("vehicles", JSON.stringify(vehicles));
        });

        it("should return correct vehicles by type", () => {
            const allVehicles = VehicleListModel.getVehicles();
            const searchType = "Sedan";

            const results = allVehicles.filter(v => v.type === searchType);

            expect(results.length).toBe(2);
            expect(results[0].name).toBe("Toyota Camry");
            expect(results[1].name).toBe("Honda Civic");
        });

        it("should return correct vehicle by make (name)", () => {
            const allVehicles = VehicleListModel.getVehicles();
            const searchMake = "Ford F-150";

            const results = allVehicles.filter(v => v.name === searchMake);

            expect(results.length).toBe(1);
            expect(results[0].registrationNumber).toBe("GHI789");
            expect(results[0].type).toBe("Truck");
        });

        it("should return correct vehicles by location", () => {
            const allVehicles = VehicleListModel.getVehicles();
            const searchLocation = "Scranton";

            const results = allVehicles.filter(v => v.location === searchLocation);

            expect(results.length).toBe(2);
            expect(results[0].name).toBe("Toyota Camry");
            expect(results[1].name).toBe("Honda Civic");
        });
    });
});
