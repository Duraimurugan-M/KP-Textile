import { useEffect, useState } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

import VendorForm from "../../Component/Vendor/VendorForm";
import VendorList from "../../Component/Vendor/VendorList";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../api/vendorApi";

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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [total, setTotal] = useState(0);

  const fetchVendors = async () => {
    try {
      const { data } = await getVendors({
        page,
        limit,
        search,
        sort,
      });

      setVendors(data.vendors || []);
      setTotal(data.total || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching suppliers");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, limit, search, sort]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Supplier name and mobile are required");
      return;
    }

    try {
      if (editId) {
        await updateVendor(editId, form);
        toast.success("Supplier updated successfully");
      } else {
        await createVendor(form);
        toast.success("Supplier added successfully");
      }

      setForm(emptyForm);
      setEditId(null);
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (vendor) => {
    setForm(vendor);
    setEditId(vendor._id);
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      try {
        await deleteVendor(id);
        toast.success("Supplier deleted successfully");
        fetchVendors();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

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
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
        onEdit={handleEdit}
        onDelete={handleDeleteVendor}
      />
    </Stack>
  );
}
