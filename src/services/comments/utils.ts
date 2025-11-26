import { COMMENT_ANALYSIS_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

// ------------ BEDROCK REQUEST BUILDER ------------- //

export const buildBedrockRequest = (text: string) => ({
    modelId: MODEL_ID,
    system: [{ text: COMMENT_ANALYSIS_SYSTEM_PROMPT }],
    messages: [
        { role: "user", content: [{ text: buildUserPrompt(text) }] }
    ],
    inferenceConfig: {
        maxTokens: 512,
        temperature: 0.0,
        topP: 1.0
    },
    requestMetadata: { source: "ai_be_dev:comment_analytics" }
});

// ------------ MODEL JSON PARSER + VALIDATOR ---------- //

export const parseModelJson = (rawOutput: string) => {
    let parsed;

    try {
        parsed = JSON.parse(rawOutput);
    } catch (err) {
        console.error("Failed to parse JSON:", rawOutput);
        return { error: "Failed to parse model JSON" };
    }

    const { sentiment, emotions, reasons } = parsed;

    if (
        typeof sentiment !== "string" ||
        !Array.isArray(emotions) ||
        !Array.isArray(reasons)
    ) {
        console.error("Unexpected JSON shape:", parsed);
        return { error: "Model returned JSON with unexpected shape" };
    }

    return {
        sentiment: sentiment.toLowerCase(),
        emotions: emotions.map((e: any) => String(e).toLowerCase()),
        reasons: reasons.map((r: any) => String(r).trim())
    };
};
