import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductsFromExcel,
  bulkCreateProducts,
} from "../controller/productController.js";

import { authGuard } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.route("/")
  .post(authGuard, createProduct)
  .get(authGuard, getAllProducts);

router.route("/:id")
  .get(authGuard, getProduct)
  .patch(authGuard, updateProduct)
  .delete(authGuard, deleteProduct);
  router.post("/bulk", authGuard, bulkCreateProducts);

 router.post(
  "/upload-excel",
  authGuard,
  upload.single("file"),
  uploadProductsFromExcel
);


export default router;
