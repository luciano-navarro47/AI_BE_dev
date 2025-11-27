import serverless from "serverless-http";
import express from "express";
import { loginController } from "../../controllers/auth.controller";

const app = express();
app.use(express.json());

app.post("/api/v1/login", loginController);

export const handler = serverless(app);
