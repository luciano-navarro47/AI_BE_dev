import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { createUserController, getAllUsersController, getUserByIdController } from "../controllers/users.controller";

const router = Router();

router.post("/users", authMiddleware, roleMiddleware(["1"]), createUserController);
router.get("/users", authMiddleware, roleMiddleware(["1"]), getAllUsersController);
router.get("/users/:userId", authMiddleware, roleMiddleware(["1"]), getUserByIdController);

export default router;
