import { ddbDocClient } from "../lib/dynamo.client";
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMO_TABLE_USERS!;

export async function createUser(item: any) {
  await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

export const getAllUsers = async () => {
  const res = await ddbDocClient.send(
    new ScanCommand({
      TableName: TABLE,
    })
  );

  return res.Items || [];
};

export const getUserById = async (userId: string) => {
  const res = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { id: userId },
    })
  );

  return res.Item || null;
};

export async function getUserByEmail(email: string) {
  const res = await ddbDocClient.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "email-index",
      KeyConditionExpression: "email = :e",
      ExpressionAttributeValues: { ":e": email },
    })
  );

  return res.Items?.[0] || null;
}
