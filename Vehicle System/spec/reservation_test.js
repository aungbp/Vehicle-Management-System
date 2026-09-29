describe("Reservation Management System", () => {

    describe("Create and Update 3 Reservations", () => {
        let vehicle1, vehicle2, vehicle3;
        let user;

        beforeEach(() => {
            localStorage.clear();

            user = { id: 1, fullName: "Michael Scott", role: "customer" };

            vehicle1 = { id: 1, name: "Toyota Camry", type: "Sedan" };
            vehicle2 = { id: 2, name: "Honda Civic", type: "Sedan" };
            vehicle3 = { id: 3, name: "Ford F-150", type: "Truck" };
        });

        it("should create three reservations", () => {
            ReservationModel.addReservation(vehicle1, user);
            ReservationModel.addReservation(vehicle2, user);
            ReservationModel.addReservation(vehicle3, user);

            const reservations = ReservationModel.getReservations();

            expect(reservations.length).toBe(3);

            expect(reservations[0].vehicle.name).toBe("Toyota Camry");
            expect(reservations[0].status).toBe("Pending");

            expect(reservations[1].vehicle.name).toBe("Honda Civic");
            expect(reservations[1].status).toBe("Pending");

            expect(reservations[2].vehicle.name).toBe("Ford F-150");
            expect(reservations[2].status).toBe("Pending");
        });

        it("should accept the first reservation", () => {
            // Create 3 reservations first
            ReservationModel.addReservation(vehicle1, user);
            ReservationModel.addReservation(vehicle2, user);
            ReservationModel.addReservation(vehicle3, user);

            const reservations = ReservationModel.getReservations();
            const firstReservationId = reservations[0].id;

            ReservationModel.updateReservationStatus(firstReservationId, "Accepted");

            const updatedReservations = ReservationModel.getReservations();
            expect(updatedReservations[0].status).toBe("Accepted");
            expect(updatedReservations[1].status).toBe("Pending");
            expect(updatedReservations[2].status).toBe("Pending");
        });

        it("should deny the second reservation", () => {
            // Create 3 reservations first
            ReservationModel.addReservation(vehicle1, user);
            ReservationModel.addReservation(vehicle2, user);
            ReservationModel.addReservation(vehicle3, user);

            const reservations = ReservationModel.getReservations();
            const secondReservationId = reservations[1].id;

            ReservationModel.updateReservationStatus(secondReservationId, "Denied");

            const updatedReservations = ReservationModel.getReservations();
            expect(updatedReservations[0].status).toBe("Pending");
            expect(updatedReservations[1].status).toBe("Denied");
            expect(updatedReservations[2].status).toBe("Pending");
        });
    });
});
