import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import PurchaseForm from "../../Component/purchase/PurchaseForm";
import PurchaseList from "../../Component/purchase/PurchaseList";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const emptyVendorForm = {
  name: "",
  mobile: "",
  email: "",
  gst: "",
  state: "",
  address: "",
};

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const clampWidthCh = (len, min = 20, max = 44) =>
  `${Math.min(Math.max(len, min), max)}ch`;

const sortedLengths = indianStates
  .map((state) => state.length)
  .sort((a, b) => b - a);

const secondLargestLength = sortedLengths[1] || sortedLengths[0];
const stateFieldWidth = clampWidthCh(secondLargestLength + 4);

export default function PurchasePage() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [vendorForm, setVendorForm] = useState(emptyVendorForm);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchData = async () => {
    try {
      const p = await customFetch.get("/products");
      const v = await customFetch.get("/vendors");
      const pur = await customFetch.get("/purchases");

      setProducts(p.data?.products || []);
      setVendors(v.data?.vendors || []);
      setPurchases(pur.data?.purchases || pur.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load purchase data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      await customFetch.post("/purchases", data);
      toast.success("Purchase added successfully");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Purchase add failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await customFetch.delete(`/purchases/${id}`);
      toast.success("Purchase deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Delete failed");
    }
  };

  const uploadExcel = async () => {
    if (!excelFile) {
      toast.warning("Choose Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await customFetch.post("/purchases/upload-excel", formData);
      toast.success("Purchase Excel uploaded successfully");
      setExcelFile(null);
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Excel upload failed");
    }
  };

  const clearFile = () => {
    setExcelFile(null);
  };

  const openAddSupplierDialog = () => {
    setVendorForm(emptyVendorForm);
    setOpenSupplierDialog(true);
  };

  const closeAddSupplierDialog = () => {
    setVendorForm(emptyVendorForm);
    setOpenSupplierDialog(false);
  };

  const handleVendorChange = (e) => {
    setVendorForm({ ...vendorForm, [e.target.name]: e.target.value });
  };

  const handleAddSupplier = async () => {
    if (!vendorForm.name || !vendorForm.mobile) {
      toast.error("Supplier name and mobile are required");
      return;
    }

    try {
      await customFetch.post("/vendors", vendorForm);
      toast.success("Supplier added successfully");
      closeAddSupplierDialog();
      fetchData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.msg ||
          "Supplier add failed"
      );
    }
  };

  const filteredPurchases = useMemo(() => {
    let data = [...purchases];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      data = data.filter((purchase) => {
        const supplierName =
          purchase?.supplier?.name?.toLowerCase() ||
          purchase?.supplierName?.toLowerCase() ||
          "";

        const productNames =
          purchase?.items?.map((item) =>
            item?.product?.name?.toLowerCase() || ""
          ) || [];

        return (
          supplierName.includes(searchValue) ||
          productNames.some((name) => name.includes(searchValue))
        );
      });
    }

    if (sort) {
      const isDesc = sort.startsWith("-");
      const key = isDesc ? sort.slice(1) : sort;

      data.sort((a, b) => {
        let aValue;
        let bValue;

        if (key === "supplier") {
          aValue = a?.supplier?.name || a?.supplierName || "";
          bValue = b?.supplier?.name || b?.supplierName || "";
        } else if (key === "totalItems") {
          aValue = a?.items?.length || 0;
          bValue = b?.items?.length || 0;
        } else if (key === "createdAt") {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return isDesc ? 1 : -1;
        if (aValue > bValue) return isDesc ? -1 : 1;
        return 0;
      });
    }

    return data;
  }, [purchases, search, sort]);

  const total = filteredPurchases.length;

  const paginatedPurchases = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPurchases.slice(start, start + limit);
  }, [filteredPurchases, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography variant="h4">Purchase Module</Typography>

      <Paper
        sx={{
          p: 3,
          mt: 3,
          border: "2px solid #999",
          background: "#fafafa",
          width: "100%",
        }}
      >
        <Typography variant="h6">Bulk Upload Purchases</Typography>

        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setExcelFile(e.target.files[0])}
            style={{
              padding: "10px",
              border: "2px dashed #999",
              borderRadius: "6px",
            }}
          />

          <Button variant="contained" sx={{ ml: 2 }} onClick={uploadExcel}>
            Upload
          </Button>

          <Button variant="outlined" sx={{ ml: 1 }} onClick={clearFile}>
            Clear
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, width: "100%" }}>
        <PurchaseForm
          products={products}
          vendors={vendors}
          onSubmit={handleSubmit}
          onOpenAddSupplier={openAddSupplierDialog}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 3, width: "100%" }}>
        <PurchaseList
          purchases={paginatedPurchases}
          products={products}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          page={page}
          setPage={setPage}
          limit={limit}
          total={total}
        />
      </Paper>

      <Dialog
        open={openSupplierDialog}
        onClose={closeAddSupplierDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Supplier</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supplier Name"
                name="name"
                value={vendorForm.name}
                onChange={handleVendorChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={vendorForm.mobile}
                onChange={handleVendorChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={vendorForm.email}
                onChange={handleVendorChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Number"
                name="gst"
                value={vendorForm.gst}
                onChange={handleVendorChange}
              />
            </Grid>

            <Grid item xs={12} md="auto">
              <Autocomplete
                options={indianStates}
                value={vendorForm.state || null}
                onChange={(event, newValue) => {
                  setVendorForm((prev) => ({
                    ...prev,
                    state: newValue || "",
                  }));
                }}
                sx={{
                  width: { xs: "100%", md: stateFieldWidth },
                  maxWidth: "100%",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    name="state"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Address"
                name="address"
                value={vendorForm.address}
                onChange={handleVendorChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={handleAddSupplier}>
                  Add Supplier
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={closeAddSupplierDialog}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
