import Vendor from "../model/Vendor.js";
import QueryBuilder from "../utils/queryBuilder.js";

/* =========================
   HELPER FUNCTION
========================= */
const cleanEmptyFields = (data) => {
  const cleaned = { ...data };

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") {
      cleaned[key] = null;
    }
  });

  return cleaned;
};

/* =========================
   DUPLICATE ERROR HANDLER
========================= */
const handleDuplicateError = (error, res) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];

    let message = "";

    if (field === "mobile") {
      message = "Mobile number already exists";
    } else if (field === "email") {
      message = "Email already exists";
    } else if (field === "gst") {
      message = "GST number already exists";
    }

    return res.status(400).json({ message });
  }

  return res.status(500).json({ message: error.message });
};

// 🔹 CREATE Vendor
export const createVendor = async (req, res) => {
  try {
    const data = cleanEmptyFields(req.body);
    const vendor = await Vendor.create(data);

    res.status(201).json(vendor);
  } catch (error) {
    handleDuplicateError(error, res);
  }
};

// 🔹 GET ALL Vendors (With Pagination, Sorting, Search, Filter)
export const getVendors = async (req, res) => {
  try {
    const query = new QueryBuilder(Vendor, req.query, {
      searchFields: ["name", "mobile", "email", "gst", "state"],
    }).build();

    const vendors = await query;
    const total = await Vendor.countDocuments();

    res.json({
      total,
      results: vendors.length,
      vendors,
    });
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
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (error) {
    handleDuplicateError(error, res);
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
