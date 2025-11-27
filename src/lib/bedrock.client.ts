import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.AWS_REGION || "us-east-1";

const sdkClient = new BedrockRuntimeClient({ region: REGION });

export type ConverseResponse = ConverseCommandOutput;

export async function invokeConverse(
  input: ConverseCommandInput
): Promise<ConverseResponse> {
  try {
    const command = new ConverseCommand(input);
    const response = await sdkClient.send(command);

    return response;
  } catch (sdkErr: any) {
    throw sdkErr;
  }
}
