import { Router } from "express";
import { meController } from "../controllers/me.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, roleMiddleware(["2"]), meController);

export default router;
