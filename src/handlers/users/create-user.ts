import serverless from "serverless-http";
import express from "express";
import { createUserController } from "../../controllers/users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.post("/api/v1/users", ADMIN_AUTH, createUserController);

export const handler = serverless(app);
