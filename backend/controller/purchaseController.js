import Purchase from "../model/Purchase.js";
import Product from "../model/Product.js";

const normalizeItems = (items = []) =>
  items.map((item) => ({
    product: item.product,
    qty: Number(item.qty),
    price: Number(item.price),
  }));

const validateItems = (items = []) =>
  items.every(
    (item) =>
      item.product &&
      Number.isFinite(item.qty) &&
      item.qty > 0 &&
      Number.isFinite(item.price) &&
      item.price >= 0
  );

/* ================= CREATE PURCHASE ================= */
export const createPurchase = async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!supplier || !items || !items.length) {
      return res.status(400).json({
        success: false,
        msg: "Supplier and items required",
      });
    }

    const normalizedItems = normalizeItems(items);

    if (!validateItems(normalizedItems)) {
      return res.status(400).json({
        success: false,
        msg: "Each item must include valid product, qty (>0), and price (>=0)",
      });
    }

    let total = 0;

    for (const item of normalizedItems) {
      total += item.qty * item.price;

      const updatedProduct = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          msg: `Product not found: ${item.product}`,
        });
      }
    }

    const purchase = await Purchase.create({
      supplier,
      items: normalizedItems,
      totalAmount: total,
    });

    res.status(201).json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/* ================= GET ALL PURCHASES ================= */
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name mobile")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/* ================= UPDATE PURCHASE ================= */
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier, items } = req.body;

    const oldPurchase = await Purchase.findById(id);

    if (!oldPurchase) {
      return res.status(404).json({ success: false, msg: "Not found" });
    }

    const normalizedItems = normalizeItems(items);

    if (!supplier || !normalizedItems.length || !validateItems(normalizedItems)) {
      return res.status(400).json({
        success: false,
        msg: "Supplier and valid items are required",
      });
    }

    // Reverse old stock first
    for (const item of oldPurchase.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    // Add new stock
    let total = 0;

    for (const item of normalizedItems) {
      total += item.qty * item.price;

      const updatedProduct = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          msg: `Product not found: ${item.product}`,
        });
      }
    }

    const updated = await Purchase.findByIdAndUpdate(
      id,
      {
        supplier,
        items: normalizedItems,
        totalAmount: total,
      },
      { new: true }
    );

    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/* ================= DELETE PURCHASE ================= */
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await Purchase.findById(id);

    if (!purchase) {
      return res.status(404).json({ success: false, msg: "Not found" });
    }

    // Reverse stock
    for (const item of purchase.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    await purchase.deleteOne();

    res.status(200).json({ success: true, msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
