import Customer from "../model/Customer.js";

/* =========================
   CREATE CUSTOMER
========================= */
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   GET ALL CUSTOMERS
========================= */
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isActive: true })
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

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

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
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   DELETE CUSTOMER (SOFT DELETE)
========================= */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { returnDocument: "after" }
    );

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};