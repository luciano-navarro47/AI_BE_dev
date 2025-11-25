import { Router } from "express";
import { loginController } from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/logout", (req, res) => res.status(204).send());

export default router;
