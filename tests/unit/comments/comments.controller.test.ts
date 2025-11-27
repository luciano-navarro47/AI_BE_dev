import {
  getAllCommentsController,
  getCommentByIdController,
  postCommentAnalyticsController,
} from "../../../src/controllers/comments.controller";

import {
  getAllCommentsService,
  getCommentByIdService,
  analyzeCommentWithBedrock,
} from "../../../src/services/comments.service";

jest.mock("../../../src/services/comments.service");

describe("comments.controller - Unit tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("getAllCommentsController - returns 200 and data on success", async () => {
    const data = [{ id: 1 }, { id: 2 }];
    (getAllCommentsService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data,
    });

    await getAllCommentsController(req, res);

    expect(getAllCommentsService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it("getAllCommentsController - returns service error status and message", async () => {
    (getAllCommentsService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 502,
      error: "Failed",
    });

    await getAllCommentsController(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed" });
  });

  it("getAllCommentsController - returns 500 on unexpected exception", async () => {
    (getAllCommentsService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    await getAllCommentsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("getCommentByIdController - returns 400 when commentId missing", async () => {
    req.params = {};
    await getCommentByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Comment ID is required",
    });
  });

  it("getCommentByIdController - returns 200 and data on success", async () => {
    const comment = { id: 10 };
    (getCommentByIdService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: comment,
    });

    req.params = { commentId: "10" };
    await getCommentByIdController(req, res);

    expect(getCommentByIdService).toHaveBeenCalledWith("10");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comment);
  });

  it("getCommentByIdController - returns service error when ok=false", async () => {
    (getCommentByIdService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "Not found",
    });

    req.params = { commentId: "999" };
    await getCommentByIdController(req, res);

    expect(getCommentByIdService).toHaveBeenCalledWith("999");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("getCommentByIdController - returns 500 on unexpected exception", async () => {
    (getCommentByIdService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    req.params = { commentId: "1" };
    await getCommentByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("postCommentAnalyticsController - returns 200 and data on success", async () => {
    const parsed = { sentiment: "positive" };
    (analyzeCommentWithBedrock as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: parsed,
    });

    req = { body: { text: "hello world" } };
    await postCommentAnalyticsController(req as any, res);

    expect(analyzeCommentWithBedrock).toHaveBeenCalledWith("hello world");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(parsed);
  });

  it("postCommentAnalyticsController - returns 400 when body missing", async () => {
    req = null as any;
    await postCommentAnalyticsController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Request body required. Send JSON { "text": "..." } with Content-Type: application/json',
    });
  });

  it("postCommentAnalyticsController - returns 400 when text missing/not string", async () => {
    req = { body: { text: 123 } };
    await postCommentAnalyticsController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "text (string) is required in body",
    });
  });

  it("postCommentAnalyticsController - returns service error when ok=false", async () => {
    (analyzeCommentWithBedrock as jest.Mock).mockResolvedValue({
      ok: false,
      status: 502,
      error: "Bedrock failed",
    });

    req = { body: { text: "hello" } };
    await postCommentAnalyticsController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ message: "Bedrock failed" });
  });

  it("postCommentAnalyticsController - returns 500 on unexpected exception", async () => {
    (analyzeCommentWithBedrock as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    req = { body: { text: "hello" } };
    await postCommentAnalyticsController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
