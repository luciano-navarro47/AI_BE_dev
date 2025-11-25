import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/auth.routes";
import meRouter from "./routes/me.routes";
import rolesRouter from "./routes/roles.routes";
import usersRouter from "./routes/users.routes";

const app = express();
app.use(express.json());

app.use("/api/v1", authRouter);
app.use("/api/v1", meRouter);
app.use("/api/v1", rolesRouter);
app.use("/api/v1", usersRouter);

export default app;
