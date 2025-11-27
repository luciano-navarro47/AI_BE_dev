import serverless from "serverless-http";
import express from "express";
import { getRoleByIdController } from "../../controllers/roles.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.get("/api/v1/roles/:roleId", ADMIN_AUTH, getRoleByIdController);

export const handler = serverless(app);
