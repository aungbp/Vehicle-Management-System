describe("Login Model", () => {

    let loginModel;

    beforeEach(() => {
        localStorage.clear();
        loginModel = new LoginModel();
    });

    it("should return an empty array if no users exist", () => {
        const users = loginModel.getUsers();
        expect(users.length).toBe(0);
    });

    it("should return users stored in 'users' in localStorage", () => {
        const sampleUsers = [
            { id: 1, fullName: "Michael Scott", email: "michael@dundermifflin.com", role: "customer" },
            { id: 2, fullName: "Dwight Schrute", email: "dwight@dundermifflin.com", role: "staff" }
        ];
        localStorage.setItem("users", JSON.stringify(sampleUsers));

        const users = loginModel.getUsers();
        expect(users.length).toBe(2);
        expect(users[0].fullName).toBe("Michael Scott");
        expect(users[1].role).toBe("staff");
    });

    it("should merge legacy customers and staff if 'users' is empty", () => {
        const legacyCustomers = [
            { id: 1, fullName: "Pam Beesly", email: "pam@dundermifflin.com", role: "customer" }
        ];
        const legacyStaff = [
            { id: 2, fullName: "Jim Halpert", email: "jim@dundermifflin.com", role: "staff" }
        ];

        localStorage.setItem("customers", JSON.stringify(legacyCustomers));
        localStorage.setItem("staff", JSON.stringify(legacyStaff));

        const users = loginModel.getUsers();
        expect(users.length).toBe(2);
        expect(users[0].fullName).toBe("Pam Beesly");
        expect(users[1].fullName).toBe("Jim Halpert");
    });
});
