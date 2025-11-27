import {
  getAllPostsController,
  getPostByIdController,
} from "../../../src/controllers/posts.controller";
import {
  getAllPostsService,
  getPostByIdService,
} from "../../../src/services/posts.service";

jest.mock("../../../src/services/posts.service");

describe("posts.controller - Unit tests", () => {
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

  it("getAllPostsController - returns 200 and posts on success", async () => {
    const posts = [{ id: 1 }, { id: 2 }];
    (getAllPostsService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: posts,
    });

    await getAllPostsController(req, res);

    expect(getAllPostsService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(posts);
  });

  it("getAllPostsController - returns service error when ok=false", async () => {
    (getAllPostsService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 502,
      error: "Failed to fetch posts",
    });

    await getAllPostsController(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch posts" });
  });

  it("getAllPostsController - returns 500 on unexpected exception", async () => {
    (getAllPostsService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    await getAllPostsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("getPostByIdController - returns 400 when postId missing", async () => {
    req.params = {};
    await getPostByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Post ID is required" });
  });

  it("getPostByIdController - returns 200 and post on success", async () => {
    const post = { id: 123, title: "Hello" };
    (getPostByIdService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: post,
    });

    req.params = { postId: "123" };
    await getPostByIdController(req, res);

    expect(getPostByIdService).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("getPostByIdController - returns service error when ok=false", async () => {
    (getPostByIdService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "Post not found",
    });

    req.params = { postId: "999" };
    await getPostByIdController(req, res);

    expect(getPostByIdService).toHaveBeenCalledWith("999");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("getPostByIdController - returns 500 on unexpected exception", async () => {
    (getPostByIdService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    req.params = { postId: "1" };
    await getPostByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
