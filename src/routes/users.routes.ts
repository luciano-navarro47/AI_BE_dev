import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createUserController, getAllUsersController, getUserByIdController } from "../controllers/users.controller";

const router = Router();

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["personal"])];

// Admin only
router.post("/users", createUserController);
router.get("/users", ADMIN_AUTH, getAllUsersController);
router.get("/users/:userId", ADMIN_AUTH, getUserByIdController);

export default router;
