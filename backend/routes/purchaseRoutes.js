import express from "express";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
  uploadPurchasesFromExcel,
} from "../controller/purchaseController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "purchase route working" });
});

router.post("/upload-excel", upload.single("file"), uploadPurchasesFromExcel);
router.post("/", createPurchase);
router.get("/", getPurchases);
router.patch("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;