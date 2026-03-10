import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import vendor from "./routes/vendor.js";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import { authGuard } from "./middleware/authMiddleware.js";


const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/customers", authGuard, customerRoutes);
app.use("/api/vendors", authGuard, vendor);
app.use("/api/products", authGuard, productRoutes);
app.use("/api/purchases", authGuard, purchaseRoutes);
app.use("/api/sales", authGuard, salesRoutes);



export default app;
