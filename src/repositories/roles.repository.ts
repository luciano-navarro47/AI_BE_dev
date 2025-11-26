import { ddbDocClient } from "../lib/dynamo.client";
import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as uuid from "uuid";

const v4 = uuid.v4;

const TABLE = process.env.DYNAMO_TABLE_ROLES;

export async function createRole(name: string) {
    const newRole = {
        id: v4(),
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE,
        Item: newRole
    });
    await ddbDocClient.send(command);
    return newRole;
}

export async function getAllRoles() {
    const command = new ScanCommand({
        TableName: TABLE,
    });
    const response = await ddbDocClient.send(command);
    return response.Items || [];
}

export async function getRoleById(id: string) {
    const command = new GetCommand({
        TableName: TABLE,
        Key: { id }
    });
    const response = await ddbDocClient.send(command);
    return response.Item;
}