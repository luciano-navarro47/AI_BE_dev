import { Request, Response } from "express";
import {
  getAllPostsService,
  getPostByIdService,
} from "../services/posts.service";

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllPostsService();
    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const result = await getPostByIdService(postId);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
