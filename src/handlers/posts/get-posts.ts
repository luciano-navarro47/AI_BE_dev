import serverless from "serverless-http";
import express from "express";
import { getAllPostsController } from "../../controllers/posts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

app.get("/api/v1/posts", ADMIN_AUTH, getAllPostsController);

export const handler = serverless(app);
