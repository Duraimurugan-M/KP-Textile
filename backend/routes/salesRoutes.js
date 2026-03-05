import express from "express";

import {
  createSale,
  getSales,
} from "../controller/salesController.js";

const router = express.Router();

router.route("/")
  .post(createSale)
  .get(getSales);

export default router;