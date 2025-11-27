import axios from "axios";
import {
  getAllPostsService,
  getPostByIdService,
} from "../../../src/services/posts.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("posts.service - Unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAllPostsService - returns posts on success", async () => {
    const fakePosts = [{ id: 1 }, { id: 2 }];
    mockedAxios.get.mockResolvedValueOnce({ data: fakePosts });

    const res = await getAllPostsService();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      { timeout: 5000 }
    );
    expect(res).toEqual({ ok: true, status: 200, data: fakePosts });
  });

  it("getAllPostsService - returns empty array when API returns non-array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    const res = await getAllPostsService();
    expect(res).toEqual({ ok: true, status: 200, data: [] });
  });

  it("getAllPostsService - returns 502 on axios error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network error"));

    const res = await getAllPostsService();
    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(res.error).toBe("Failed to fetch posts from external API");
  });

  it("getPostByIdService - returns 400 when postId missing", async () => {
    const res = await getPostByIdService("" as any);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
    expect(res.error).toBe("Post ID is required");
  });

  it("getPostByIdService - returns 200 and post on success", async () => {
    const fakePost = { id: 10, title: "x" };
    mockedAxios.get.mockResolvedValueOnce({ data: fakePost });

    const res = await getPostByIdService("10");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts/10",
      { timeout: 5000 }
    );
    expect(res).toEqual({ ok: true, status: 200, data: fakePost });
  });

  it("getPostByIdService - returns 404 when axios returns 404", async () => {
    const axiosError: any = new Error("not found");
    axiosError.response = { status: 404 };
    mockedAxios.get.mockRejectedValueOnce(axiosError);

    const res = await getPostByIdService("9999");
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
    expect(res.error).toBe("Post not found");
  });

  it("getPostByIdService - returns 502 for other axios errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network fail"));

    const res = await getPostByIdService("100");
    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(res.error).toBe("Failed to fetch post from external API");
  });

  it("getPostByIdService - handles unexpected exception inside axios block and returns 502", async () => {
    jest
      .spyOn(global as any, "encodeURIComponent")
      .mockImplementationOnce(() => {
        throw new Error("boom");
      });

    const res = await getPostByIdService("100");
    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(res.error).toBe("Failed to fetch post from external API");

    (global.encodeURIComponent as any).mockRestore?.();
  });
});
