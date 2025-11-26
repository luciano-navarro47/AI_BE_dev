
import { Request, Response } from "express";
import { loginService } from "../services/auth.service";
import { addToBlacklist } from "../services/blacklist.service";

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { ok, status, data, error } = await loginService(email, password);

        if (!ok) {
            return res.status(status).json({ message: error });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error("loginController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        const { token } = req.body ?? {};

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        addToBlacklist(token);

        return res.status(204).send();
    } catch (error) {
        console.error("logoutController error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}