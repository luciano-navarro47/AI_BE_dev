
import {
    BedrockRuntimeClient,
    ConverseCommand,
    ConverseCommandInput,
    ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.AWS_REGION || "us-east-1";

const STATIC_API_KEY = (process.env.BEDROCK_API_KEY || process.env.AWS_BEARER_TOKEN_BEDROCK || "").trim() || null;

const REST_BASE = `https://bedrock-runtime.${REGION}.amazonaws.com`;

const sdkClient = new BedrockRuntimeClient({ region: REGION });

export type ConverseResponse = ConverseCommandOutput;

export async function invokeConverse(input: ConverseCommandInput): Promise<ConverseResponse> {
    try {

        const command = new ConverseCommand(input);
        const response = await sdkClient.send(command);

        return response;

    } catch (sdkErr: any) {
        const name = sdkErr?.name ?? "";
        console.warn("[bedrock.client] SDK invocation failed:", name, sdkErr?.message ?? sdkErr);

        if ((name === "AccessDeniedException" || name === "AccessDenied" || name === "AuthFailure") && (STATIC_API_KEY)) {
            try {
                console.log("[bedrock.client] Falling back to REST using Bearer token...");

            } catch (restErr) {
                console.error("[bedrock.client] REST fallback failed:", restErr);

                throw sdkErr;
            }
        }

        throw sdkErr;
    }
}