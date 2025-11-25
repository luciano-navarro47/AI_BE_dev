import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/auth.routes";
// import meRouter from "./routes/me";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    return res.json({ message: "API running" });
})

app.post("/login", (req, res) => {
    return res.json({ message: "Login placeholder" });
})

app.use("/api/v1", authRouter);
// app.use("/api/v1", meRouter);

export default app;
