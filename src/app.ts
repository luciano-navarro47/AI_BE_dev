import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/auth.routes";
// import meRouter from "./routes/me";

const app = express();
app.use(express.json());

app.use("/api/v1", authRouter);
// app.use("/api/v1", meRouter);

export default app;
