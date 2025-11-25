import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { loginService } from "../services/auth.service";

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const { email, password } = body;

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email and password are required" }),
            };
        }

        const result = await loginService(email, password);

        if (!result.ok) {
            return {
                statusCode: result.status,
                body: JSON.stringify({ message: result.error || "Unauthorized" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.data),
        };
    } catch (err) {
        console.error("login handler error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
