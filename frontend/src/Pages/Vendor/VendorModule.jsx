import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import VendorForm from "../../Component/Vendor/VendorForm";
import VendorList from "../../Component/Vendor/VendorList";

const STORAGE_KEY = "vendors";

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  gst: "",
  state: "",
  address: "",
};

export default function VendorModule() {
  // ✅ SAFE INITIALIZATION
  const [vendors, setVendors] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);

  // 💾 SAVE ONLY WHEN vendors CHANGE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  }, [vendors]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile) {
      alert("Vendor name and mobile are required");
      return;
    }

    if (editIndex !== null) {
      const updated = [...vendors];
      updated[editIndex] = form;
      setVendors(updated);
      setEditIndex(null);
    } else {
      setVendors([...vendors, form]);
    }

    setForm(emptyForm);
  };

  const handleEdit = (index) => {
    setForm(vendors[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this vendor?")) {
      setVendors(vendors.filter((_, i) => i !== index));
    }
  };

  return (
    <Stack spacing={3}>
      <VendorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={editIndex !== null}
      />

      <VendorList
        vendors={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Stack>
  );
}
