import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { getAllPostsController, getPostByIdController } from "../controllers/posts.controller";

const router = Router();
const ADMIN_AUTH = [authMiddleware, roleMiddleware(["admin"])];

// Admin only
router.get("/posts", ADMIN_AUTH, getAllPostsController);
router.get("/posts/:postId", ADMIN_AUTH, getPostByIdController);

export default router;
