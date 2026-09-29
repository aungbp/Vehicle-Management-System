describe("Vehicle Management System", () => {

    describe("Vehicle Addition", () => {
        let vehicle1, vehicle2, vehicle3;

        beforeEach(() => {
            localStorage.clear();

            vehicle1 = { name: "Toyota Camry", type: "Sedan", price: 25000 };
            vehicle2 = { name: "Honda Civic", type: "Sedan", price: 22000 };
            vehicle3 = { name: "Ford F-150", type: "Truck", price: 35000 };
        });

        it("should add the first vehicle correctly", () => {
            Vehicle.addVehicle(vehicle1);
            const vehicles = Vehicle.getVehicles();

            expect(vehicles.length).toBe(1);
            expect(vehicles[0].id).toBe(1);
            expect(vehicles[0].name).toBe("Toyota Camry");
            expect(vehicles[0].type).toBe("Sedan");
            expect(vehicles[0].price).toBe(25000);
        });

        it("should add the second vehicle correctly", () => {
            Vehicle.addVehicle(vehicle1);
            Vehicle.addVehicle(vehicle2);
            const vehicles = Vehicle.getVehicles();

            expect(vehicles.length).toBe(2);
            expect(vehicles[1].id).toBe(2);
            expect(vehicles[1].name).toBe("Honda Civic");
            expect(vehicles[1].type).toBe("Sedan");
            expect(vehicles[1].price).toBe(22000);
        });

        it("should add the third vehicle correctly", () => {
            Vehicle.addVehicle(vehicle1);
            Vehicle.addVehicle(vehicle2);
            Vehicle.addVehicle(vehicle3);
            const vehicles = Vehicle.getVehicles();

            expect(vehicles.length).toBe(3);
            expect(vehicles[2].id).toBe(3);
            expect(vehicles[2].name).toBe("Ford F-150");
            expect(vehicles[2].type).toBe("Truck");
            expect(vehicles[2].price).toBe(35000);
        });
    });
});
