import { Request, Response } from "express";
import {
  getMyInfoService,
  getPostCommentsService,
  getPostDetailService,
  getPostsService,
} from "../services/me.service";

export const meController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.email) {
      return res
        .status(401)
        .json({ message: "User email not available in token" });
    }

    const result = await getMyInfoService(user.email);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const mePostsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.email) {
      return res
        .status(401)
        .json({ message: "User email not available in token" });
    }

    const result = await getPostsService(user.email);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const mePostDetailController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const postId = req.params.postId;

    if (!postId) {
      return res.status(401).json({ message: "Post ID is required" });
    }

    const result = await getPostDetailService(user.email, postId);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const mePostCommentsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const postId = req.params.postId;

    if (!postId) {
      return res.status(401).json({ message: "Post ID is required" });
    }

    const result = await getPostCommentsService(user.email, postId);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
