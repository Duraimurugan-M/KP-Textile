import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import axios from "axios";
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

  // ✅ Fetch Customers From Backend
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers", error);
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
      alert("Customer name and mobile are required");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/customers/${editId}`,
          form
        );
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/customers",
          form
        );
      }

      setForm(emptyForm);
      fetchCustomers(); // refresh list
    } catch (error) {
      console.error("Error saving customer", error);
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditId(customer._id);
  };

  const handleDelete = async (customer) => {
    if (window.confirm("Delete this customer?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/customers/${customer._id}`
        );
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer", error);
      }
    }
  };

  return (
    <Stack spacing={3}>
      <CustomerForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
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