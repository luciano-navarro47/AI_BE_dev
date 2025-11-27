import serverless from "serverless-http";
import express from "express";
import { createRoleController } from "../../controllers/roles.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.post("/api/v1/roles", ADMIN_AUTH, createRoleController);

export const handler = serverless(app);
