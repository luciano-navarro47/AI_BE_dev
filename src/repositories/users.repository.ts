import { ddbDocClient } from "../lib/dynamo.client";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMO_USERS_TABLE!;

// const USE_MOCK_USERS = process.env.USE_MOCK_USERS === "true";

// const mockUser = {
//     id: "1",
//     email: "test@example.com",
//     passwordHash: "$2b$10$EbaSEH5ZezKGLwMelVKdIOsc1jlKTp5YScspJ4q5m/aBAmY3AZ23W",
//     roleId: "1"
// }

export async function createUser(item: any) {
    // if (USE_MOCK_USERS) {
    //     console.log("[MOCK]: createUser called")
    //     return item;
    // }

    await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
}
export async function getUserByEmail(email: string) {

    // if (USE_MOCK_USERS) {
    //     if (email === mockUser.email) {
    //         return mockUser;
    //     }
    //     return null;

    // }

    const res = await ddbDocClient.send(
        new QueryCommand({
            TableName: TABLE,
            IndexName: "email-index",
            KeyConditionExpression: "email = :e",
            ExpressionAttributeValues: { ":e": email }
        })
    );

    return res.Items?.[0] || null;
}
