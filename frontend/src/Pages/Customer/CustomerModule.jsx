import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { toast } from "react-toastify";

import customFetch from "../../utils/customFetch";

import CustomerForm from "../../Component/Customer/CustomerForm";
import CustomerList from "../../Component/Customer/CustomerList";

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  gst: "",
  state: "",
  address: "",
};

export default function CustomerModule() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await customFetch.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.warning("Customer name and mobile are required");
      return;
    }

    try {
      if (editId) {
        await customFetch.put(`/customers/${editId}`, form);

        toast.success("Customer updated successfully");
        setEditId(null);
      } else {
        await customFetch.post("/customers", form);

        toast.success("Customer added successfully");
      }

      setForm(emptyForm);
      fetchCustomers();

    } catch (error) {

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }

    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditId(customer._id);
  };

  const handleDelete = async (customer) => {
    if (window.confirm("Delete this customer?")) {
      try {
        await customFetch.delete(`/customers/${customer._id}`);

        toast.success("Customer deleted successfully");
        fetchCustomers();

      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <Stack spacing={3}>
      <CustomerForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={!!editId}
      />

      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Stack>
  );
}