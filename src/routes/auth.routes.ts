import { Router } from "express";
import { loginController, logoutController } from "../controllers/auth.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.post("/login", loginController);
router.post("/logout", authMiddleware, roleMiddleware(["1", "2"]), logoutController);

export default router;
