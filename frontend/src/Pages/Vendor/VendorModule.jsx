import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import customFetch from "../../utils/customFetch";
import VendorForm from "../../Component/Vendor/VendorForm";
import VendorList from "../../Component/Vendor/VendorList";

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  gst: "",
  state: "",
  address: "",
};

export default function VendorModule() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // ✅ GET ALL (getVendors controller)
  const fetchVendors = async () => {
    try {
      const { data } = await customFetch.get("vendors");
      setVendors(data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CREATE OR UPDATE
  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      alert("Vendor name and mobile are required");
      return;
    }

    try {
      if (editId) {
        // 🔹 CALLS updateVendor controller
        await customFetch.put(`vendors/${editId}`, form);
      } else {
        // 🔹 CALLS createVendor controller
        await customFetch.post("vendors", form);
      }

      setForm(emptyForm);
      setEditId(null);
      fetchVendors();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // ✅ EDIT (only sets state, no backend call here)
  const handleEdit = (vendor) => {
    setForm({
      name: vendor.name || "",
      mobile: vendor.mobile || "",
      email: vendor.email || "",
      gst: vendor.gst || "",
      state: vendor.state || "",
      address: vendor.address || "",
    });
    setEditId(vendor._id);
  };

  // ✅ DELETE (calls deleteVendor controller)
  const handleDelete = async (id) => {
    if (window.confirm("Delete this vendor?")) {
      try {
        await customFetch.delete(`vendors/${id}`);
        fetchVendors();
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    }
  };

  return (
    <Stack spacing={3}>
      <VendorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={!!editId}
      />

      <VendorList
        vendors={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Stack>
  );
}