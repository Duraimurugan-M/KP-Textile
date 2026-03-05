import Sale from "../model/Sale.js";
import Product from "../model/Product.js";

/* ================= CREATE SALE ================= */

export const createSale = async (req, res) => {
  try {

    const { customer, gstMode, items, grossTotal, discountTotal, grandTotal } =
      req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        msg: "Sale items required",
      });
    }

    for (const item of items) {

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: "Product not found",
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          msg: `Insufficient stock for ${product.name}`,
        });
      }

      product.stock -= item.qty;

      await product.save();
    }

    const sale = await Sale.create({
      customer,
      gstMode,
      items,
      grossTotal,
      discountTotal,
      grandTotal,
    });

    res.status(201).json({
      success: true,
      sale,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });

  }
};

/* ================= GET SALES ================= */

export const getSales = async (req, res) => {

  try {

    const sales = await Sale.find()
      .populate("customer", "name mobile")
      .populate("items.product", "name productCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sales,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: error.message,
    });

  }

};