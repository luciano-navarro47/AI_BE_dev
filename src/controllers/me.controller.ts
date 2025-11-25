import { Request, Response } from "express";
import { getMyInfoService, getMyPostsService } from "../services/me.service";

export const meController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const result = await getMyInfoService(user.userId);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.error });
        }

        return res.status(200).json(result.data);
    } catch (err) {
        console.error("meController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const mePostsController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user || !user.userId) {
            return res.status(401).json({ message: "User ID not available in token" });
        }

        const result = await getMyPostsService(user.userId);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.error });
        }

        return res.status(200).json(result.data);
    } catch (err) {
        console.error("mePostsController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};