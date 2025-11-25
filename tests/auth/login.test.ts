import request from "supertest";
import app from "../../src/app";

describe("POST /login", () => {
    it("should return 200 and a valid token with correct credentials", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "usuario@mock.com",
                password: "123456"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("should return 401 with invalid credentials", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "usuario@mock.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
});
