import Vendor from "../model/vendor.model.js";


// 🔹 CREATE Vendor
export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
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
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 DELETE Vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};