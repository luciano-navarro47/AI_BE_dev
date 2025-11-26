import { Request, Response } from "express";
import {
    getAllCommentsService,
    getCommentByIdService,
    // analyzeCommentWithBedrock 
} from "../services/comments.service";

export const getAllCommentsController = async (req: Request, res: Response) => {
    try {
        const result = await getAllCommentsService();
        if (!result.ok) return res.status(result.status ?? 500).json({ message: result.error });
        return res.status(200).json(result.data);
    } catch (err) {
        console.error("getAllCommentsController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCommentByIdController = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) return res.status(400).json({ message: "Comment ID is required" });

        const result = await getCommentByIdService(commentId);
        if (!result.ok) return res.status(result.status ?? 500).json({ message: result.error });
        return res.status(200).json(result.data);
    } catch (err) {
        console.error("getCommentByIdController error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// export const postCommentAnalyticsController = async (req: Request, res: Response) => {
//     try {
//         const { text } = req.body;
//         if (!text || typeof text !== "string") {
//             return res.status(400).json({ message: "text (string) is required in body" });
//         }

//         const result = await analyzeCommentWithBedrock(text);
//         if (!result.ok) return res.status(result.status ?? 500).json({ message: result.error });

//         return res.status(200).json(result.data);
//     } catch (err) {
//         console.error("postCommentAnalyticsController error:", err);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
