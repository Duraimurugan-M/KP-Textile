import Vendor from "../model/vendor.model.js";

/* =========================
   HELPER FUNCTION
========================= */
const cleanEmptyFields = (data) => {
  const cleaned = { ...data };

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") {
      cleaned[key] = null; // null works properly with sparse index
    }
  });

  return cleaned;
};

// 🔹 CREATE Vendor
export const createVendor = async (req, res) => {
  try {
    const data = cleanEmptyFields(req.body);

    const vendor = await Vendor.create(data);

    res.status(201).json(vendor);
  } catch (error) {

  // 🔥 Handle duplicate key error properly
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];

    let message = "";

    if (field === "mobile") {
      message = "Mobile number already exists";
    } 
    else if (field === "email") {
      message = "Email already exists";
    } 
    else if (field === "gst") {
      message = "GST number already exists";
    }

    return res.status(400).json({ message });
  }

  res.status(500).json({ message: error.message });
}
};

// 🔹 GET ALL Vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET SINGLE Vendor
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE Vendor
export const updateVendor = async (req, res) => {
  try {
    const data = cleanEmptyFields(req.body);

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true, // very important
      }
    );

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (error) {

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];

    let message = "";

    if (field === "mobile") {
      message = "Mobile number already exists";
    } 
    else if (field === "email") {
      message = "Email already exists";
    } 
    else if (field === "gst") {
      message = "GST number already exists";
    }

    return res.status(400).json({ message });
  }

  res.status(500).json({ message: error.message });
}
};

// 🔹 DELETE Vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    await vendor.deleteOne();

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};