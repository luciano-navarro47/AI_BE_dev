import {
  getAllComments,
  getCommentById,
} from "../adapters/jsonplaceholder.adapter";

import { invokeConverse } from "../lib/bedrock.client";
import { buildBedrockRequest, parseModelJson } from "./comments/utils";

export const getAllCommentsService = async () => {
  try {
    const data = await getAllComments();
    return { ok: true, status: 200, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 502,
      error: "Failed to fetch comments from external API",
    };
  }
};

export const getCommentByIdService = async (commentId: string) => {
  if (!commentId)
    return { ok: false, status: 400, error: "Comment ID is required" };

  try {
    const data = await getCommentById(commentId);

    if (!data || Object.keys(data).length === 0) {
      return { ok: false, status: 404, error: "Comment not found" };
    }

    return { ok: true, status: 200, data };
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { ok: false, status: 404, error: "Comment not found" };
    }

    return {
      ok: false,
      status: 502,
      error: "Failed to fetch comment from external API",
    };
  }
};

export const analyzeCommentWithBedrock = async (text: string) => {
  if (!text?.trim()) {
    return { ok: false, status: 400, error: "Text is required" };
  }

  const input = buildBedrockRequest(text);

  try {
    const response = await invokeConverse(input as any);

    const outputBlocks = response.output?.message?.content ?? [];
    const rawText = outputBlocks.map((c: any) => c.text ?? "").join("");

    const parsed = parseModelJson(rawText);

    if (parsed.error) {
      return { ok: false, status: 502, error: parsed.error };
    }

    return { ok: true, status: 200, data: parsed };
  } catch (err: any) {
    switch (err?.name) {
      case "AccessDeniedException":
        return { ok: false, status: 403, error: "Access denied to Bedrock" };
      case "ModelTimeoutException":
        return { ok: false, status: 504, error: "Bedrock model timeout" };
      case "ThrottlingException":
        return { ok: false, status: 429, error: "Bedrock throttling" };
      case "ModelNotReadyException":
      case "ServiceUnavailableException":
        return { ok: false, status: 503, error: "Bedrock unavailable" };
      default:
        return {
          ok: false,
          status: 500,
          error: "Internal server error calling Bedrock",
        };
    }
  }
};
