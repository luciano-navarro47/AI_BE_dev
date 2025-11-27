import serverless from "serverless-http";
import express from "express";
import { getAllUsersController } from "../../controllers/users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.get("/api/v1/users", ADMIN_AUTH, getAllUsersController);

export const handler = serverless(app);
