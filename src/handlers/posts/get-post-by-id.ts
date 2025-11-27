import serverless from "serverless-http";
import express from "express";
import { getPostByIdController } from "../../controllers/posts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.get("/api/v1/posts/:postId", ADMIN_AUTH, getPostByIdController);

export const handler = serverless(app);
