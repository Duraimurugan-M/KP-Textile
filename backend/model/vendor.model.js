import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,   // ✅ UNIQUE
      trim: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    email: {
      type: String,
      unique: true,   // ✅ UNIQUE
      sparse: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    gst: {
      type: String,
      unique: true,   // ✅ UNIQUE
      sparse: true,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please enter a valid GST number",
      ],
    },
    state: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);