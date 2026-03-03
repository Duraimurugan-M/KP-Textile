import express from "express";
import { createAdmin, login, logout, me } from "../controller/authController.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
