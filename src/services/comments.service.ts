import axios from "axios";
import { invokeConverse } from "../lib/bedrock.client";

const COMMENTS_API_URL = "https://jsonplaceholder.typicode.com/comments";
const AXIOS_TIMEOUT = 5000;
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

type AnalysisResult = {
    sentiment: string;
    emotions: string[];
    reasons: string[];
};

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
    try {
        if (!commentId) return { ok: false, status: 400, error: "Comment ID is required" };

        try {
            const res = await axios.get(`${COMMENTS_API_URL}/${encodeURIComponent(commentId)}`, { timeout: AXIOS_TIMEOUT });
            if (!res.data || Object.keys(res.data).length === 0) {
                return { ok: false, status: 404, error: "Comment not found" };
            }
            return { ok: true, status: 200, data: res.data };
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                return { ok: false, status: 404, error: "Comment not found" };
            }
            console.error("getCommentByIdService error (axios):", err?.message ?? err);
            return { ok: false, status: 502, error: "Failed to fetch comment from external API" };
        }
    } catch (err: any) {
        console.error("getCommentByIdService error:", err);
        return { ok: false, status: 500, error: "Internal server error" };
    }
};

export const analyzeCommentWithBedrock = async (text: string): Promise<{ ok: boolean; status?: number; data?: AnalysisResult; error?: string }> => {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        return { ok: false, status: 400, error: "Text is required" };
    }

    // Messages: Clear instruction for the model to respond only with JSON in Spanish
    const systemPrompt = `Eres un analizador de sentimiento y emociones en español. Responde EXCLUSIVAMENTE con un JSON válido con estas claves:
                        - "sentiment": uno de los valores "positivo", "negativo" o "neutral".
                        - "emotions": array de strings cortos en español (ej. "enojo", "tristeza").
                        - "reasons": array de strings, cada elemento es una frase breve que justifique el sentimiento.
                        No añadas explicaciones, texto adicional, ni markdown. Devuelve únicamente el JSON.`;

    const userPrompt = `Analiza el siguiente comentario y devuelve el JSON en español siguiendo las reglas del sistema:\n\n"${text}"`;

    // Build input according to the Converse spec: use `system` at root, and `messages` with only "user" roles  
    const messages = [
        { role: "user", content: [{ text: userPrompt }] }
    ];

    const system = [{ text: systemPrompt }];

    const input = {
        modelId: MODEL_ID,
        system,
        messages,
        inferenceConfig: {
            maxTokens: 512,
            temperature: 0.2,
            topP: 1.0
        },
        requestMetadata: { source: "ai_be_dev:comment_analytics" }
    };

    try {
        const response = await invokeConverse(input as any); // cast because the SDK uses long types

        // Get text content from response
        const outputBlocks = response.output?.message?.content ?? [];

        const textOutput = outputBlocks.map((c: any) => c.text ?? "").join("");

        let parsed: any;
        try {
            parsed = JSON.parse(textOutput);
        } catch (err) {
            console.error("Failed to parse JSON from model:", err, "rawJSON:", textOutput);
            return { ok: false, status: 502, error: "Failed to parse model JSON" };
        }

        // Validate shape
        if (
            !parsed ||
            typeof parsed.sentiment !== "string" ||
            !Array.isArray(parsed.emotions) ||
            !Array.isArray(parsed.reasons)
        ) {
            console.error("Model returned JSON with unexpected shape:", parsed);
            return { ok: false, status: 502, error: "Model returned JSON with unexpected shape" };
        }

        // Normalize values to expected format (all in Spanish, lowercase)
        const sentiment = String(parsed.sentiment).toLowerCase();
        const emotions = parsed.emotions.map((e: any) => String(e).toLowerCase());
        const reasons = parsed.reasons.map((r: any) => String(r).trim());

        const result: AnalysisResult = { sentiment, emotions, reasons };

        return { ok: true, status: 200, data: result };

    } catch (err: any) {
        // Map common SDK/Bedrock errors to appropriate status
        const name = err?.name ?? "";
        console.error("analyzeCommentWithBedrock error:", err);

        if (name === "AccessDeniedException") return { ok: false, status: 403, error: "Access denied to Bedrock" };
        if (name === "ModelNotReadyException" || name === "ServiceUnavailableException") return { ok: false, status: 503, error: "Bedrock model not ready or service unavailable" };
        if (name === "ThrottlingException") return { ok: false, status: 429, error: "Bedrock throttling" };
        if (name === "ModelTimeoutException") return { ok: false, status: 504, error: "Bedrock model timeout" };

        // fallback
        return { ok: false, status: 500, error: "Internal server error calling Bedrock" };
    }
};
