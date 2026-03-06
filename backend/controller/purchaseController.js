import Purchase from "../model/Purchase.js";
import Product from "../model/Product.js";
import Vendor from "../model/Vendor.js";
import XLSX from "xlsx";

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
      .populate("items.product", "name productCode")
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

    for (const item of oldPurchase.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
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

    for (const item of purchase.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    await purchase.deleteOne();

    res.status(200).json({ success: true, msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/* ================= EXCEL UPLOAD PURCHASES ================= */
export const uploadPurchasesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "No file uploaded",
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!data.length) {
      return res.status(400).json({
        success: false,
        msg: "Excel file is empty",
      });
    }

    const groupedPurchases = {};
    const duplicateCheck = new Set();
    const pickValue = (row, keys = []) => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
          return row[key];
        }
      }
      return "";
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      const productCode = String(
        pickValue(row, [
          "Product Code",
          "productCode",
          "product code",
          "product_code",
          "ProductCode",
        ])
      ).trim();
      const supplierNumber = String(
        pickValue(row, [
          "Supplier Number",
          "Vendor Number",
          "supplierNumber",
          "vendorNumber",
          "supplier number",
          "vendor number",
          "mobile",
        ])
      ).trim();
      const qty = Number(
        pickValue(row, ["Qty", "qty", "Qtn", "qtn", "Quantity", "quantity"])
      );
      const price = Number(
        pickValue(row, ["Price", "price", "Rate", "rate"])
      );

      if (!productCode || !supplierNumber) {
        return res.status(400).json({
          success: false,
          msg: `Row ${rowNumber}: Product Code and Vendor Number are required`,
        });
      }

      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          msg: `Row ${rowNumber}: Qty must be greater than 0`,
        });
      }

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          msg: `Row ${rowNumber}: Price must be 0 or greater`,
        });
      }

      const duplicateKey = `${supplierNumber}__${productCode}`;

      if (duplicateCheck.has(duplicateKey)) {
        return res.status(400).json({
          success: false,
          msg: `Row ${rowNumber}: Duplicate Product Code and Supplier Number in Excel`,
        });
      }

      duplicateCheck.add(duplicateKey);

      const product = await Product.findOne({ productCode });

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: `Row ${rowNumber}: Product not found for code ${productCode}`,
        });
      }

      const supplier = await Vendor.findOne({ mobile: supplierNumber });

      if (!supplier) {
        return res.status(404).json({
          success: false,
          msg: `Row ${rowNumber}: Supplier not found for number ${supplierNumber}`,
        });
      }

      const supplierId = supplier._id.toString();

      if (!groupedPurchases[supplierId]) {
        groupedPurchases[supplierId] = {
          supplier: supplier._id,
          items: [],
          totalAmount: 0,
        };
      }

      groupedPurchases[supplierId].items.push({
        product: product._id,
        qty,
        price,
      });

      groupedPurchases[supplierId].totalAmount += qty * price;
    }

    const purchasesToInsert = Object.values(groupedPurchases);

    for (const purchase of purchasesToInsert) {
      for (const item of purchase.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty },
        });
      }
    }

    const inserted = await Purchase.insertMany(purchasesToInsert);

    res.status(201).json({
      success: true,
      count: inserted.length,
      purchases: inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
