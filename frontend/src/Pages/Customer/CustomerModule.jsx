import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";

import CustomerForm from "../../Component/Customer/CustomerForm";
import CustomerList from "../../Component/Customer/CustomerList";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api/customerApi";

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

  // ✅ Query states (same as vendor)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [total, setTotal] = useState(0);

  const fetchCustomers = async () => {
    try {
      const { data } = await getCustomers({
        page,
        limit,
        search,
        sort,
      });

      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, search, sort]);

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
        await updateCustomer(editId, form);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(form);
        toast.success("Customer added successfully");
      }

      setForm(emptyForm);
      setEditId(null);
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditId(customer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this customer?")) {
      try {
        await deleteCustomer(id);
        toast.success("Customer deleted successfully");
        fetchCustomers();
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
    <Stack spacing={3} sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h4">
        Customer Management
      </Typography>

      <CustomerForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={!!editId}
      />

      <CustomerList
        customers={customers}
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
        onDelete={handleDelete}
      />
    </Stack>
  );
}
