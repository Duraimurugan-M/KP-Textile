import Customer from "../model/Customer.js";

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
   CREATE CUSTOMER
========================= */
export const createCustomer = async (req, res) => {
  try {

    const cleanedData = cleanEmptyFields(req.body);

    const customer = await Customer.create(cleanedData);

    res.status(201).json(customer);

  } catch (error) {

    if (error.code === 11000) {

      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    res.status(400).json({ message: error.message });
  }
};


/* =========================
   GET ALL CUSTOMERS
========================= */
export const getCustomers = async (req, res) => {
  try {

    const customers = await Customer
      .find()
      .sort({ createdAt: -1 });

    res.json(customers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   GET SINGLE CUSTOMER
========================= */
export const getCustomerById = async (req, res) => {
  try {

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json(customer);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* =========================
   UPDATE CUSTOMER
========================= */
export const updateCustomer = async (req, res) => {
  try {

    const cleanedData = cleanEmptyFields(req.body);

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      cleanedData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json(updatedCustomer);

  } catch (error) {

    if (error.code === 11000) {

      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    res.status(400).json({ message: error.message });
  }
};


/* =========================
   DELETE CUSTOMER (HARD DELETE)
========================= */
export const deleteCustomer = async (req, res) => {
  try {

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      message: "Customer deleted successfully"
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};