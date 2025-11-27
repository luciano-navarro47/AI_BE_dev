import request from "supertest";
import app from "../../../src/app";
import { ddbDocClient } from "../../../src/lib/dynamo.client";
import bcrypt from "bcryptjs";

jest.mock("../../../src/lib/jwt", () => ({
  signJwt: jest.fn(() => "fake-jwt-token"),
}));

const mockUser = {
  id: "1",
  email: "test@example.com",
  passwordHash: "$2b$10$EbaSEH5ZezKGLwMelVKdIOsc1jlKTp5YScspJ4q5m/aBAmY3AZ23W",
  role: "admin",
};

const mockForbiddenUser = {
  id: "2",
  email: "user-forbidden@example.com",
  passwordHash: "$2b$10$EbaSEH5ZezKGLwMelVKdIOsc1jlKTp5YScspJ4q5m/aBAmY3AZ23W",
  role: "forbidden",
};

describe("POST /api/v1/login", () => {
  beforeAll(() => {
    jest
      .spyOn(ddbDocClient, "send")
      .mockImplementation(async (command: any) => {
        if (command.constructor?.name === "QueryCommand") {
          const email = command.input?.ExpressionAttributeValues?.[":e"];
          if (email === mockUser.email) return { Items: [mockUser] };
          if (email === mockForbiddenUser.email)
            return { Items: [mockForbiddenUser] };
          return { Items: [] };
        }
        // return empty object for other commands
        return {};
      });

    // mock bcrypt.compare: only "123456" -> true
    jest.spyOn(bcrypt, "compare").mockImplementation(async (plain, hash) => {
      return plain === "123456";
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 and a valid token with correct credentials", async () => {
    const response = await request(app).post("/api/v1/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", "fake-jwt-token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
  });

  it("should return 401 with invalid password", async () => {
    const response = await request(app).post("/api/v1/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid password");
  });

  it("should return 403 if role is not allowed", async () => {
    const response = await request(app).post("/api/v1/login").send({
      email: "user-forbidden@example.com",
      password: "123456",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "Forbidden: role not allowed"
    );
  });

  it("should return 401 if user not found", async () => {
    const response = await request(app).post("/api/v1/login").send({
      email: "no-such-user@example.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});
