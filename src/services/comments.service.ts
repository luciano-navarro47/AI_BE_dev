import axios from "axios";
// import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const COMMENTS_API_URL = "https://jsonplaceholder.typicode.com/comments";
const AXIOS_TIMEOUT = 5000;

// type BedrockAnalysisResult = {
//     sentiment: string;
//     emotions: string[];
//     reasons: string[];
// };

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

/**
 * analyzeCommentWithBedrock
 *
 * Sends the provided text to AWS Bedrock Converse API with Anthropic Claude model
 * and expects the model to respond with a JSON payload containing:
 * { sentiment: string, emotions: string[], reasons: string[] }
 *
 * Implementation uses dynamic import of @aws-sdk/client-bedrock-runtime to avoid
 * potential named-export issues in some CommonJS setups.
 */
// export const analyzeCommentWithBedrock = async (text: string): Promise<{ ok: boolean; status?: number; data?: BedrockAnalysisResult; error?: string }> => {
//     if (!text || typeof text !== "string" || text.trim().length === 0) {
//         return { ok: false, status: 400, error: "Text is required for analysis" };
//     }

//     try {
//         // dynamic import to be robust with different module systems


//         const region = process.env.AWS_REGION || "us-east-1"; // ajustar si hace falta
//         const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

//         const client = new BedrockRuntimeClient({ region });

//         // Build a system + user message instructing Claude to return strict JSON
//         const systemPrompt = `Eres un analizador de sentimiento y emociones. Responde EXCLUSIVAMENTE con un JSON válido
// con las claves: "sentiment" (valores: "positivo" | "negativo" | "neutral"),
// "emotions" (array de strings cortos en español),
// "reasons" (array de strings, cada elemento es una frase breve que justifica el sentimiento).
// No agregues texto adicional fuera del JSON.`;

//         const userPrompt = `Analiza el siguiente comentario en español y devuelve el JSON solicitado:\n\n"${text}"\n\nDevuelve el JSON únicamente.`;

//         const messages = [
//             { role: "system", content: [{ text: systemPrompt }] },
//             { role: "user", content: [{ text: userPrompt }] }
//         ];

//         const inferenceConfig = {
//             maxTokens: 1024,
//             temperature: 0.0, // determinista
//         };

//         const command = new ConverseCommand({
//             modelId,
//             messages,
//             inferenceConfig,
//         });

//         const response = await client.send(command);

//         // response.output.message.content is an array — buscar texto que contenga JSON
//         const output = response.output?.message?.content ?? [];
//         // concatenar posibles fragments de texto
//         const textOutput = output.map((c: any) => c.text ?? "").join("");

//         // Intentar extraer JSON del textoOutput robustamente
//         const firstBrace = textOutput.indexOf("{");
//         const lastBrace = textOutput.lastIndexOf("}");
//         if (firstBrace === -1 || lastBrace === -1) {
//             console.error("Bedrock response didn't contain JSON:", textOutput);
//             return { ok: false, status: 502, error: "Model did not return JSON as expected" };
//         }

//         const jsonStr = textOutput.substring(firstBrace, lastBrace + 1);

//         let parsed: any;
//         try {
//             parsed = JSON.parse(jsonStr);
//         } catch (err) {
//             console.error("Failed to parse model JSON:", err, "raw:", jsonStr);
//             return { ok: false, status: 502, error: "Failed to parse model response" };
//         }

//         // basic validation of parsed shape
//         if (!parsed || typeof parsed.sentiment !== "string" || !Array.isArray(parsed.emotions) || !Array.isArray(parsed.reasons)) {
//             return { ok: false, status: 502, error: "Model returned JSON with unexpected shape" };
//         }

//         // Normalize sentiment strings to lowercase Spanish words
//         parsed.sentiment = String(parsed.sentiment).toLowerCase();

//         return { ok: true, status: 200, data: parsed as BedrockAnalysisResult };
//     } catch (err: any) {
//         console.error("analyzeCommentWithBedrock error:", err?.message ?? err);
//         return { ok: false, status: 500, error: "Internal server error calling Bedrock" };
//     }
// };
