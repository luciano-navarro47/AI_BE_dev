import serverless from "serverless-http";
import express from "express";
import { meController } from "../../controllers/me.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const USER_AUTH = [authMiddleware, roleMiddleware(["personal"])];

app.get("/api/v1/me", USER_AUTH, meController);

export const handler = serverless(app);
