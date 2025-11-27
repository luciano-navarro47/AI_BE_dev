import { mePostDetailController } from "../../../src/controllers/me.controller";
import { getPostDetailService } from "../../../src/services/me.service";

jest.mock("../../../src/services/me.service");

describe("mePostDetailController - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { email: "test@example.com" },
      params: { postId: "123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and post data when ok=true", async () => {
    const mockPost = { id: 123, title: "Test" };

    (getPostDetailService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: mockPost,
    });

    await mePostDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPost);
  });

  it("should return 401 if postId is missing", async () => {
    req.params.postId = undefined;

    await mePostDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Post ID is required" });
  });

  it("should return service error when ok=false", async () => {
    (getPostDetailService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      error: "Not authorized",
    });

    await mePostDetailController(req, res);

    expect(getPostDetailService).toHaveBeenCalledWith(
      "test@example.com",
      "123"
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
  });

  it("should return 500 on unexpected error", async () => {
    (getPostDetailService as jest.Mock).mockRejectedValue(new Error("Boom"));

    await mePostDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
