import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  qty: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  cgst: Number,
  sgst: Number,
  igst: Number,

  total: Number,
},
{ _id: false }
);

const saleSchema = new mongoose.Schema(
{
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },

  gstMode: {
    type: String,
    enum: ["with", "without"],
    default: "with",
  },

  items: [saleItemSchema],

  grossTotal: Number,
  discountTotal: Number,
  grandTotal: Number,
},
{ timestamps: true }
);

export default mongoose.model("Sale", saleSchema);