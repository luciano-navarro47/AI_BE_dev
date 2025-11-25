import request from "supertest";
import app from "../../src/app";

describe("POST /api/v1/login", () => {
    it("should return 200 and a valid token with correct credentials", async () => {
        const response = await request(app)
            .post("/api/v1/login")
            .send({
                email: "test@example.com",
                password: "123456"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("should return 401 with invalid credentials", async () => {
        const response = await request(app)
            .post("/api/v1/login")
            .send({
                email: "test@example.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
});
