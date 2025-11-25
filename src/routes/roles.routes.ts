import { Router } from "express";
import { roleMiddleware } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    createRoleController,
    getRolesController,
    getRoleByIdController
} from "../controllers/roles.controller";

const router = Router();

const ADMIN_AUTH = [authMiddleware, roleMiddleware(["1"])];

router.post("/roles", ADMIN_AUTH, createRoleController);
router.get("/roles", ADMIN_AUTH, getRolesController);
router.get("/roles/:roleId", ADMIN_AUTH, getRoleByIdController);

export default router;
