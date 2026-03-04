import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { toast } from "react-toastify";
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

  const fetchVendors = async () => {
    try {
      const { data } = await customFetch.get("vendors");
      setVendors(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Vendor name and mobile are required");
      return;
    }

    try {
      if (editId) {
        await customFetch.put(`vendors/${editId}`, form);
        toast.success("Vendor updated successfully");
      } else {
        await customFetch.post("vendors", form);
        toast.success("Vendor added successfully");
      }

      setForm(emptyForm);
      setEditId(null);
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vendor?")) {
      try {
        await customFetch.delete(`vendors/${id}`);
        toast.success("Vendor deleted successfully");
        fetchVendors();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  // ✅ NEW CANCEL FUNCTION
  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <Stack spacing={3}>
      <VendorForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
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