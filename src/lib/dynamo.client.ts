import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.IS_LOCAL === "true";

const client = new DynamoDBClient(
    isLocal
        ? { region: process.env.AWS_REGION || "us-east-1", endpoint: "http://localhost:8000" }
        : { region: process.env.AWS_REGION || "us-east-1" }
);

export const ddbDocClient = DynamoDBDocumentClient.from(client);
