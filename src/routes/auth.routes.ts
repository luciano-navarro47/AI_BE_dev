import { Router } from "express";
import { loginController, logoutController } from "../controllers/auth.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.post("/login", loginController);
router.post("/logout", authMiddleware, roleMiddleware(["admin", "personal"]), logoutController);

export default router;
