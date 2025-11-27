jest.mock("../../src/middlewares/auth.middleware", () => {
  return {
    authMiddleware: (req: any, res: any, next: any) => {
      req.user = { userId: "1", role: "admin", email: "test@example.com" };
      return next();
    },
  };
});

jest.mock("../../src/middlewares/role.middleware", () => {
  return {
    roleMiddleware: (_allowedRoles: string[]) => {
      return (req: any, res: any, next: any) => {
        return next();
      };
    },
  };
});

import request from "supertest";
import app from "../../src/app";
import * as blacklistService from "../../src/services/blacklist.service";

describe("POST /api/v1/logout (integration)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 400 when token is missing", async () => {
    const res = await request(app).post("/api/v1/logout").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Token is required");
  });

  it("adds token to blacklist and returns 204 when token provided", async () => {
    const spy = jest
      .spyOn(blacklistService, "addToBlacklist")
      .mockImplementation(() => {});

    const payload = { token: "abc.def.ghi" };
    const res = await request(app).post("/api/v1/logout").send(payload);

    expect(res.status).toBe(204);
    expect(spy).toHaveBeenCalledWith(payload.token);
  });

  it("returns 500 if blacklist service throws", async () => {
    jest.spyOn(blacklistService, "addToBlacklist").mockImplementation(() => {
      throw new Error("boom");
    });

    const res = await request(app)
      .post("/api/v1/logout")
      .send({ token: "abc.def.ghi" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
  });
});
