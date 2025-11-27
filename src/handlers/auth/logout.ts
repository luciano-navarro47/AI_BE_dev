import serverless from "serverless-http";
import express from "express";
import { logoutController } from "../../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const app = express();
app.use(express.json());

app.post(
  "/api/v1/logout",
  authMiddleware,
  roleMiddleware(["admin", "personal"]),
  logoutController
);

export const handler = serverless(app);
