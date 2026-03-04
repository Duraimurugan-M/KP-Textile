import express from "express";
import {
  createPurchase,
  deletePurchase,
  getPurchases,
  updatePurchase,
} from "../controller/purchaseController.js";

const router = express.Router();

router.route("/")
  .post(createPurchase)
  .get(getPurchases);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;