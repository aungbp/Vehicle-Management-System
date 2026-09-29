describe("User Management System", () => {

    describe("Customer Creation", () => {
        let userModel, customer1, customer2, customer3;

        beforeEach(() => {
            localStorage.clear();
            userModel = new UserModel();

            customer1 = new Customer(
                null, 
                "Michael Scott",
                "michael@dundermifflin.com",
                "5551234567",
                "paper123",
                "Scranton, PA",
                "Regular"
            );

            customer2 = new Customer(
                null, 
                "Pam Beesly",
                "pam@dundermifflin.com",
                "5559876543",
                "art123",
                "Scranton, PA",
                "Regular"
            );

            customer3 = new Customer(
                null,
                "Jim Halpert",
                "jim@dundermifflin.com",
                "5551112222",
                "prank123",
                "Scranton, PA",
                "VIP"
            );
        });

        it("should add the first customer correctly", () => {
            userModel.addUser(customer1);
            const users = userModel.getAllUsers();

            expect(users.length).toBe(1);
            expect(users[0].fullName).toBe("Michael Scott");
            expect(users[0].email).toBe("michael@dundermifflin.com");
            expect(users[0].role).toBe("customer");
            expect(users[0].registrationDate).toBeDefined();
            expect(users[0].activeStatus).toBe("Active");
        });

        it("should add a second customer correctly", () => {
            userModel.addUser(customer1);
            userModel.addUser(customer2);
            const users = userModel.getAllUsers();

            expect(users.length).toBe(2);
            expect(users[1].fullName).toBe("Pam Beesly");
            expect(users[1].email).toBe("pam@dundermifflin.com");
            expect(users[1].role).toBe("customer");
            expect(users[1].registrationDate).toBeDefined();
            expect(users[1].activeStatus).toBe("Active");
        });

        it("should add a third customer correctly", () => {
            userModel.addUser(customer1);
            userModel.addUser(customer2);
            userModel.addUser(customer3);
            const users = userModel.getAllUsers();

            expect(users.length).toBe(3);
            expect(users[2].fullName).toBe("Jim Halpert");
            expect(users[2].email).toBe("jim@dundermifflin.com");
            expect(users[2].role).toBe("customer");
            expect(users[2].registrationDate).toBeDefined();
            expect(users[2].activeStatus).toBe("Active");
        });
    });
});
