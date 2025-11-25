import { ddbDocClient } from "../../src/lib/dynamo.client";
import { jest } from "@jest/globals";

export function mockGetUserByEmail(email: string, user: any | null) {
    jest.spyOn(ddbDocClient, "send").mockImplementation(async (command: any) => {
        if (command.constructor.name === "QueryCommand") {
            if (user && command.input.ExpressionAttributeValues[":e"] === email) {
                return { Items: [user] };
            }
            return { Items: [] };
        }
        return {};
    });
}
