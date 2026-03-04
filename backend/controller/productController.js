import Product from "../model/Product.js";
import XLSX from "xlsx";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      productCode,
      hsnCode,
      category,
      fabric,
      color,
      price,
      stock,
      description,
    } = req.body;

    if (!name || !productCode || !hsnCode || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        msg: "Name, Product Code, HSN Code, Category and Price are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        msg: "Price cannot be negative",
      });
    }

    if (stock && stock < 0) {
      return res.status(400).json({
        success: false,
        msg: "Stock cannot be negative",
      });
    }

    const existing = await Product.findOne({ productCode });

    if (existing) {
      return res.status(400).json({
        success: false,
        msg: "Product code already exists",
      });
    }

    const product = await Product.create({
      name,
      productCode,
      hsnCode,
      category,
      fabric,
      color,
      price,
      stock,
      description,
    });

    res.status(201).json({
      success: true,
      product,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Duplicate product code",
      });
    }

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= GET ALL PRODUCTS ================= */
export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= GET SINGLE PRODUCT ================= */
export const getProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    if (req.body.price !== undefined && req.body.price < 0) {
      return res.status(400).json({
        success: false,
        msg: "Price cannot be negative",
      });
    }

    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({
        success: false,
        msg: "Stock cannot be negative",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= BULK CREATE PRODUCTS ================= */
export const bulkCreateProducts = async (req, res) => {
  try {

    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Products array required",
      });
    }

    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
      stock: Number(p.stock),
    }));

    const inserted = await Product.insertMany(formattedProducts);

    res.status(201).json({
      success: true,
      count: inserted.length,
      products: inserted,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Duplicate product code in list",
      });
    }

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


/* ================= EXCEL UPLOAD ================= */
export const uploadProductsFromExcel = async (req, res) => {
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

    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({
        success: false,
        msg: "Excel file is empty",
      });
    }

    const formatted = data.map((row) => ({
      name: row.name,
      productCode: row.productCode,
      hsnCode: row.hsnCode,
      category: row.category,
      fabric: row.fabric,
      color: row.color,
      price: Number(row.price),
      stock: Number(row.stock),
      description: row.description || "",
    }));

    const inserted = await Product.insertMany(formatted);

    res.status(201).json({
      success: true,
      count: inserted.length,
      products: inserted,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Duplicate product code in Excel",
      });
    }

    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};