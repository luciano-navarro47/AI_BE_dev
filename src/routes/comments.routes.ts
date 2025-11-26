import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import {
    getAllCommentsController,
    getCommentByIdController,
    // postCommentAnalyticsController 
} from "../controllers/comments.controller";

const router = Router();
const ADMIN_AUTH = [authMiddleware, roleMiddleware(["1"])];

// Admin only
router.get("/comments", ADMIN_AUTH, getAllCommentsController);
router.get("/comments/:commentId", ADMIN_AUTH, getCommentByIdController);
// router.post("/comment/analytics", ADMIN_AUTH, postCommentAnalyticsController);

export default router;
