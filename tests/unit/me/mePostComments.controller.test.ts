import { mePostCommentsController } from "../../../src/controllers/me.controller";
import { getPostCommentsService } from "../../../src/services/me.service";

jest.mock("../../../src/services/me.service");

describe("mePostCommentsController - Unit Tests", () => {
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

  it("should return 200 and comments data when ok=true", async () => {
    const mockComments = [{ id: 1 }, { id: 2 }];

    (getPostCommentsService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: mockComments,
    });

    await mePostCommentsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockComments);
  });

  it("should return 401 if postId is missing", async () => {
    req.params.postId = undefined;

    await mePostCommentsController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Post ID is required" });
  });

  it("should return service error when ok=false", async () => {
    (getPostCommentsService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "Comments not found",
    });

    await mePostCommentsController(req, res);

    expect(getPostCommentsService).toHaveBeenCalledWith(
      "test@example.com",
      "123"
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Comments not found" });
  });

  it("should return 500 on unexpected error", async () => {
    (getPostCommentsService as jest.Mock).mockRejectedValue(new Error("Boom"));

    await mePostCommentsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
