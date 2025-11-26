import axios from "axios";
import { invokeConverse } from "../lib/bedrock.client";
import { buildBedrockRequest, parseModelJson } from "./comments/utils";

const COMMENTS_API_URL = "https://jsonplaceholder.typicode.com/comments";
const AXIOS_TIMEOUT = 5000;

export const getAllCommentsService = async () => {
    try {
        const res = await axios.get(COMMENTS_API_URL, { timeout: AXIOS_TIMEOUT });
        return { ok: true, status: 200, data: Array.isArray(res.data) ? res.data : [] };
    } catch (err: any) {
        console.error("getAllCommentsService error:", err?.message ?? err);
        return { ok: false, status: 502, error: "Failed to fetch comments from external API" };
    }
};

export const getCommentByIdService = async (commentId: string) => {
    if (!commentId) return { ok: false, status: 400, error: "Comment ID is required" };

    try {
        const res = await axios.get(`${COMMENTS_API_URL}/${encodeURIComponent(commentId)}`, { timeout: AXIOS_TIMEOUT });

        if (!res.data || Object.keys(res.data).length === 0) {
            return { ok: false, status: 404, error: "Comment not found" };
        }

        return { ok: true, status: 200, data: res.data };
    } catch (err: any) {
        if (err.response?.status === 404) {
            return { ok: false, status: 404, error: "Comment not found" };
        }

        console.error("getCommentByIdService error:", err?.message ?? err);
        return { ok: false, status: 502, error: "Failed to fetch comment from external API" };
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
        console.error("analyzeCommentWithBedrock error:", err);

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
                return { ok: false, status: 500, error: "Internal server error calling Bedrock" };
        }
    }
};
