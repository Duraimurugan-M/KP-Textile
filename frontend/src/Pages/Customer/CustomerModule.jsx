import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import CustomerForm from "../../Component/Customer/CustomerForm";
import CustomerList from "../../Component/Customer/CustomerList";

const STORAGE_KEY = "customers";

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  gst: "",
  state: "",
  address: "",
};

export default function CustomerModule() {
  // ✅ SAFE INITIALIZATION (NO DATA LOSS)
  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);

  // 💾 SAVE TO localStorage (ONLY AFTER INIT)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile) {
      alert("Customer name and mobile are required");
      return;
    }

    if (editIndex !== null) {
      const updated = [...customers];
      updated[editIndex] = form;
      setCustomers(updated);
      setEditIndex(null);
    } else {
      setCustomers([...customers, form]);
    }

    setForm(emptyForm);
  };

  const handleEdit = (index) => {
    setForm(customers[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this customer?")) {
      setCustomers(customers.filter((_, i) => i !== index));
    }
  };

  return (
    <Stack spacing={3}>
      <CustomerForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={editIndex !== null}
      />

      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Stack>
  );
}
