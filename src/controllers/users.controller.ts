import { Request, Response } from "express";
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
} from "../services/users.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const result = await createUserService(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(201).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsersService();

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await getUserByIdService(userId);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
