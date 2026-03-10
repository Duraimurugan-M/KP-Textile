import express from "express";
import { createAdmin, login, logout, me } from "../controller/authController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login", login);
router.post("/logout", authGuard, logout);
router.get("/me", authGuard, me);

export default router;
