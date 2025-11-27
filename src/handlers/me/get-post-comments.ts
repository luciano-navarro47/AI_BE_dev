import serverless from "serverless-http";
import express from "express";
import { mePostCommentsController } from "../../controllers/me.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

const USER_AUTH = [authMiddleware, roleMiddleware(["personal"])];

app.get(
  "/api/v1/me/posts/:postId/comments",
  USER_AUTH,
  mePostCommentsController
);

export const handler = serverless(app);
