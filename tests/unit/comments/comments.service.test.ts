import {
  getAllCommentsService,
  getCommentByIdService,
  analyzeCommentWithBedrock,
} from "../../../src/services/comments.service";

import {
  getAllComments,
  getCommentById,
} from "../../../src/adapters/jsonplaceholder.adapter";
import { invokeConverse } from "../../../src/lib/bedrock.client";
import {
  buildBedrockRequest,
  parseModelJson,
} from "../../../src/services/comments/utils";

jest.mock("../../../src/adapters/jsonplaceholder.adapter");
jest.mock("../../../src/lib/bedrock.client");
jest.mock("../../../src/services/comments/utils");

describe("comments.service - Unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCommentsService", () => {
    it("should return data and 200 status on success", async () => {
      const mockData = [{ id: 1, name: "Test Comment" }];
      (getAllComments as jest.Mock).mockResolvedValue(mockData);

      const result = await getAllCommentsService();

      expect(getAllComments).toHaveBeenCalled();
      expect(result).toEqual({
        ok: true,
        status: 200,
        data: mockData,
      });
    });

    it("should return 502 error when adapter throws exception", async () => {
      (getAllComments as jest.Mock).mockRejectedValue(new Error("API Error"));

      const result = await getAllCommentsService();

      expect(result).toEqual({
        ok: false,
        status: 502,
        error: "Failed to fetch comments from external API",
      });
    });
  });

  describe("getCommentByIdService", () => {
    it("should return 400 if commentId is missing", async () => {
      const result = await getCommentByIdService("");
      expect(result).toEqual({
        ok: false,
        status: 400,
        error: "Comment ID is required",
      });
      expect(getCommentById).not.toHaveBeenCalled();
    });

    it("should return data and 200 status on success", async () => {
      const mockData = { id: 10, name: "Specific Comment" };
      (getCommentById as jest.Mock).mockResolvedValue(mockData);

      const result = await getCommentByIdService("10");

      expect(getCommentById).toHaveBeenCalledWith("10");
      expect(result).toEqual({
        ok: true,
        status: 200,
        data: mockData,
      });
    });

    it("should return 404 when data is empty object (logical not found)", async () => {
      (getCommentById as jest.Mock).mockResolvedValue({});

      const result = await getCommentByIdService("999");

      expect(result).toEqual({
        ok: false,
        status: 404,
        error: "Comment not found",
      });
    });

    it("should return 404 when adapter throws 404 error", async () => {
      const error: any = new Error("Not Found");
      error.response = { status: 404 };
      (getCommentById as jest.Mock).mockRejectedValue(error);

      const result = await getCommentByIdService("999");

      expect(result).toEqual({
        ok: false,
        status: 404,
        error: "Comment not found",
      });
    });

    it("should return 502 on generic adapter error", async () => {
      (getCommentById as jest.Mock).mockRejectedValue(
        new Error("Network Error")
      );

      const result = await getCommentByIdService("1");

      expect(result).toEqual({
        ok: false,
        status: 502,
        error: "Failed to fetch comment from external API",
      });
    });
  });

  describe("analyzeCommentWithBedrock", () => {
    const mockText = "This is a great product";
    const mockRequestPayload = { some: "payload" };

    it("should return 400 if text is missing or empty", async () => {
      const result = await analyzeCommentWithBedrock("   ");
      expect(result).toEqual({
        ok: false,
        status: 400,
        error: "Text is required",
      });
      expect(invokeConverse).not.toHaveBeenCalled();
    });

    it("should return 200 and parsed data on success", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      (parseModelJson as jest.Mock).mockReturnValue({ sentiment: "positive" });

      const bedrockResponse = {
        output: {
          message: {
            content: [{ text: '{"sentiment": "positive"}' }],
          },
        },
      };
      (invokeConverse as jest.Mock).mockResolvedValue(bedrockResponse);

      const result = await analyzeCommentWithBedrock(mockText);

      expect(buildBedrockRequest).toHaveBeenCalledWith(mockText);
      expect(invokeConverse).toHaveBeenCalledWith(mockRequestPayload);
      expect(parseModelJson).toHaveBeenCalledWith('{"sentiment": "positive"}');
      expect(result).toEqual({
        ok: true,
        status: 200,
        data: { sentiment: "positive" },
      });
    });

    it("should return 502 if parseModelJson returns an error", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      (invokeConverse as jest.Mock).mockResolvedValue({
        output: { message: { content: [{ text: "Invalid JSON" }] } },
      });
      (parseModelJson as jest.Mock).mockReturnValue({
        error: "Invalid JSON format",
      });

      const result = await analyzeCommentWithBedrock(mockText);

      expect(result).toEqual({
        ok: false,
        status: 502,
        error: "Invalid JSON format",
      });
    });

    it("should return 403 on AccessDeniedException", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      const err = new Error("Access Denied");
      err.name = "AccessDeniedException";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      const result = await analyzeCommentWithBedrock(mockText);

      expect(result).toEqual({
        ok: false,
        status: 403,
        error: "Access denied to Bedrock",
      });
    });

    it("should return 504 on ModelTimeoutException", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      const err = new Error("Timeout");
      err.name = "ModelTimeoutException";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      const result = await analyzeCommentWithBedrock(mockText);

      expect(result).toEqual({
        ok: false,
        status: 504,
        error: "Bedrock model timeout",
      });
    });

    it("should return 429 on ThrottlingException", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      const err = new Error("Throttled");
      err.name = "ThrottlingException";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      const result = await analyzeCommentWithBedrock(mockText);

      expect(result).toEqual({
        ok: false,
        status: 429,
        error: "Bedrock throttling",
      });
    });

    it("should return 503 on ServiceUnavailableException or ModelNotReadyException", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);

      let err = new Error("Unavailable");
      err.name = "ServiceUnavailableException";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      let result = await analyzeCommentWithBedrock(mockText);
      expect(result.status).toBe(503);
      expect(result.error).toBe("Bedrock unavailable");

      err.name = "ModelNotReadyException";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      result = await analyzeCommentWithBedrock(mockText);
      expect(result.status).toBe(503);
    });

    it("should return 500 on unexpected AWS or general errors", async () => {
      (buildBedrockRequest as jest.Mock).mockReturnValue(mockRequestPayload);
      const err = new Error("Boom");
      err.name = "UnknownError";
      (invokeConverse as jest.Mock).mockRejectedValue(err);

      const result = await analyzeCommentWithBedrock(mockText);

      expect(result).toEqual({
        ok: false,
        status: 500,
        error: "Internal server error calling Bedrock",
      });
    });
  });
});
