import { Router } from "express";
import { meController, mePostsController, mePostCommentsController, mePostDetailController } from "../controllers/me.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const USER_AUTH = [authMiddleware, roleMiddleware(["personal"])];

// User only
router.get("/me", USER_AUTH, meController);
router.get("/me/posts", USER_AUTH, mePostsController);
router.get("/me/posts/:postId", USER_AUTH, mePostDetailController);
router.get("/me/posts/:postId/comments", USER_AUTH, mePostCommentsController);

export default router;
