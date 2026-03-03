import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL)
.split(",")
.map((origin) => origin.trim())
.filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;