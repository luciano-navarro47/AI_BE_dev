import { mePostsController } from "../../../src/controllers/me.controller";
import { getPostsService } from "../../../src/services/me.service";

jest.mock("../../../src/services/me.service");

describe("mePostsController - Unit Tests", () => {
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

  it("should return 200 and posts data when ok=true", async () => {
    const mockPosts = [{ id: 1 }, { id: 2 }];

    (getPostsService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: mockPosts,
    });

    await mePostsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPosts);
  });

  it("should return 401 if user is missing", async () => {
    req.user = null;

    await mePostsController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User email not available in token",
    });
  });

  it("should return error status and message from service when ok=false", async () => {
    (getPostsService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "Posts not found",
    });

    await mePostsController(req, res);

    expect(getPostsService).toHaveBeenCalledWith("test@example.com");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Posts not found" });
  });

  it("should return 500 on unexpected error", async () => {
    (getPostsService as jest.Mock).mockRejectedValue(new Error("Boom"));

    await mePostsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
