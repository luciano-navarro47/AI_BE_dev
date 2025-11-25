import { Router } from "express";
import { meController, mePostsController, mePostDetailController } from "../controllers/me.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();

router.get("/me", authMiddleware, roleMiddleware(["2"]), meController);

router.get("/me/posts", authMiddleware, roleMiddleware(["2"]), mePostsController);
router.get("/me/posts/:postId", authMiddleware, roleMiddleware(["2"]), mePostDetailController);

export default router;
