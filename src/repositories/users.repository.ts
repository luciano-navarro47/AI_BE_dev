import { ddbDocClient } from "../lib/dynamo.client";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.USERS_TABLE!;

export async function createUser(item: any) {
    await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
}
export async function getUserByEmail(email: string) {
    const res = await ddbDocClient.send(new QueryCommand({
        TableName: TABLE,
        IndexName: "email-index",
        KeyConditionExpression: "email = :e",
        ExpressionAttributeValues: { ":e": email }
    }));
    return res.Items?.[0] || null;
}
