import serverless from "serverless-http";
import express from "express";
import { getUserByIdController } from "../../controllers/users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.get("/api/v1/users/:userId", ADMIN_AUTH, getUserByIdController);

export const handler = serverless(app);
