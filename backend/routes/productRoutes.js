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
  .post(createProduct)
  .get(getAllProducts);

router.route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.post("/bulk", bulkCreateProducts);

router.post(
  "/upload-excel",
  upload.single("file"),
  uploadProductsFromExcel
);


export default router;
