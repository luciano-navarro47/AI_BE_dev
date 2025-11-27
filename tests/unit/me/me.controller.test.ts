import { meController } from "../../../src/controllers/me.controller";
import { getMyInfoService } from "../../../src/services/me.service";

jest.mock("../../../src/services/me.service");

describe("meController - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { user: { email: "test@example.com" } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is missing from req", async () => {
    req.user = null;

    await meController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User email not available in token",
    });
  });

  it("should return the status and error from service when ok=false", async () => {
    (getMyInfoService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "User not found",
    });

    await meController(req, res);

    expect(getMyInfoService).toHaveBeenCalledWith("test@example.com");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 200 and user data when ok=true", async () => {
    const fakeUser = { id: 1, name: "Test" };

    (getMyInfoService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: fakeUser,
    });

    await meController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
  });

  it("should return 500 on unexpected error", async () => {
    (getMyInfoService as jest.Mock).mockRejectedValue(new Error("Boom"));

    await meController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
