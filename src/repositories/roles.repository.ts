import { ddbDocClient } from "../lib/dynamo.client";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMO_TABLE_ROLES;

export async function getRoleById(id: string) {
    const command = new GetCommand({
        TableName: TABLE,
        Key: {
            id
        }
    });
    const response = await ddbDocClient.send(command);
    console.log("RES DDBCLIENT: ", response);
    return response.Item;
}