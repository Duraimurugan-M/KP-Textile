import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  exportLedgerToExcel,
  exportLedgerToPdf,
  filterLedgerRows,
  formatDateTime,
  paginateRows,
  sortLedgerRows,
} from "./ledgerHelpers";

const COLORS = ["#d32f2f", "#1976d2", "#2e7d32", "#f57c00", "#6a1b9a"];

export default function PurchaseLedger() {
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-dateRaw");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await customFetch.get("/purchases");
        const purchases = data?.purchases || [];

        const rows = purchases.map((purchase) => {
          const items = purchase.items || [];
          const qty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
          // Always compute from purchase entry price, not product master/sales price.
          const totalPurchaseCost = items.reduce(
            (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
            0
          );
          const total = totalPurchaseCost;
          const priceValues = items.map((item) => `Rs ${Number(item.price || 0).toLocaleString()}`);
          const products =
            items
              .map((item) => item?.product?.name || item?.product?.productCode || "Product")
              .join(", ") || "-";
          const productCodes =
            items
              .map((item) => item?.product?.productCode || item?.productCode || "-")
              .join(", ") || "-";

          return {
            id: purchase._id,
            dateRaw: purchase.createdAt,
            date: formatDateTime(purchase.createdAt),
            vendor: purchase.supplier?.name || "Unknown",
            products,
            productCodes,
            items: items.length,
            qty,
            priceValues,
            total,
          };
        });

        setAllRows(rows);
      } catch {
        toast.error("Failed to load purchase ledger");
        setAllRows([]);
      }
    };

    fetchPurchases();
  }, []);

  const vendorOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.vendor))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [allRows]
  );

  const filteredRows = useMemo(
    () =>
      filterLedgerRows({
        rows: allRows,
        search,
        fromDate,
        toDate,
        searchFields: ["vendor", "products"],
        exactFilters: { vendor: selectedVendor },
      }),
    [allRows, search, fromDate, toDate, selectedVendor]
  );

  const sortedRows = useMemo(
    () => sortLedgerRows(filteredRows, sort),
    [filteredRows, sort]
  );

  const pagedRows = useMemo(
    () => paginateRows(sortedRows, page, limit),
    [sortedRows, page, limit]
  );
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / limit));

  const monthlyPurchase = useMemo(() => {
    const monthMap = {};

    filteredRows.forEach((row) => {
      const date = new Date(row.dateRaw);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      monthMap[key] = (monthMap[key] || 0) + row.total;
    });

    return Object.keys(monthMap).map((month) => ({
      month,
      amount: monthMap[month],
    }));
  }, [filteredRows]);

  const vendorPurchase = useMemo(() => {
    const map = {};

    filteredRows.forEach((row) => {
      map[row.vendor] = (map[row.vendor] || 0) + row.total;
    });

    return Object.keys(map).map((name) => ({ name, value: map[name] }));
  }, [filteredRows]);

  const exportColumns = [
    { label: "Date", key: "date" },
    { label: "Supplier", key: "vendor" },
    { label: "Products", key: "products" },
    { label: "Product Code", key: "productCodes" },
    { label: "Items", key: "items" },
    { label: "Total Qty", key: "qty" },
    {
      label: "Price",
      value: (row) => (row.priceValues?.length ? row.priceValues.join(", ") : "Rs 0"),
    },
    { label: "Total Amount", value: (row) => `Rs ${Number(row.total || 0).toLocaleString()}` },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2} sx={{ mb: 2, width: "100%", m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Purchase Ledger
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Monthly purchase trends, supplier-wise distribution, and detailed purchase history
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ width: "100%", m: 0 }} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" mb={2}>
              Monthly Purchase Trend
            </Typography>

            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyPurchase}
                  margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                >
                  <XAxis
                    dataKey="month"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#d32f2f" fill="#ffcdd2" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" mb={2}>
              Supplier-wise Purchase
            </Typography>

            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorPurchase}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isMobile ? 55 : 75}
                    outerRadius={isMobile ? 95 : 120}
                    cx="50%"
                    cy="50%"
                    label={!isMobile}
                  >
                    {vendorPurchase.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">Purchase Ledger (Detailed)</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    exportLedgerToExcel({
                      rows: sortedRows,
                      columns: exportColumns,
                      title: "Purchase Ledger",
                      fileName: "purchase-ledger",
                    })
                  }
                >
                  Export Excel
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    exportLedgerToPdf({
                      rows: sortedRows,
                      columns: exportColumns,
                      title: "Purchase Ledger",
                      fileName: "purchase-ledger",
                    })
                  }
                >
                  Export PDF
                </Button>
              </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
              <TextField
                size="small"
                placeholder="Search supplier or product"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
              <TextField
                select
                size="small"
                label="Sort"
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                SelectProps={{ native: true }}
              >
                <option value="-dateRaw">Newest</option>
                <option value="dateRaw">Oldest</option>
                <option value="vendor">Supplier A-Z</option>
                <option value="-vendor">Supplier Z-A</option>
                <option value="-total">Amount High-Low</option>
                <option value="total">Amount Low-High</option>
                <option value="-qty">Qty High-Low</option>
                <option value="qty">Qty Low-High</option>
              </TextField>
              <TextField
                select
                size="small"
                label="Supplier"
                value={selectedVendor}
                onChange={(e) => {
                  setPage(1);
                  setSelectedVendor(e.target.value);
                }}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: { xs: "100%", sm: 170 }, maxWidth: "100%" }}
              >
                <option value="">All</option>
                {vendorOptions.map((vendor) => (
                  <option key={vendor} value={vendor}>
                    {vendor}
                  </option>
                ))}
              </TextField>
              <TextField
                size="small"
                type="date"
                label="From"
                value={fromDate}
                onChange={(e) => {
                  setPage(1);
                  setFromDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="To"
                value={toDate}
                onChange={(e) => {
                  setPage(1);
                  setToDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Typography variant="h6" mb={2}>
              Filtered Results: {sortedRows.length}
            </Typography>

            <TableContainer sx={{ overflowX: isMobile ? "auto" : "hidden" }}>
              <Table
                size="small"
                sx={{ minWidth: isMobile ? 1100 : "100%", tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "5%" }}>
                      #
                    </TableCell>
                    <TableCell sx={{ width: "13%" }}>Date</TableCell>
                    <TableCell sx={{ width: "12%" }}>Supplier</TableCell>
                    <TableCell sx={{ width: "20%" }}>Products</TableCell>
                    <TableCell sx={{ width: "13%" }}>Product Code</TableCell>
                    <TableCell align="center" sx={{ width: "7%" }}>
                      Items
                    </TableCell>
                    <TableCell align="center" sx={{ width: "8%" }}>
                      Total Qty
                    </TableCell>
                    <TableCell align="right" sx={{ width: "10%" }}>
                      Price
                    </TableCell>
                    <TableCell align="right" sx={{ width: "11%" }}>
                      Total Amount
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No purchases found
                      </TableCell>
                    </TableRow>
                  )}

                  {pagedRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell>{row.products}</TableCell>
                      <TableCell>{row.productCodes}</TableCell>
                      <TableCell align="center">{row.items}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
                      <TableCell align="right">
                        {row.priceValues?.length ? (
                          row.priceValues.map((price, idx) => <div key={idx}>{price}</div>)
                        ) : (
                          "Rs 0"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {`Rs ${Number(row.total || 0).toLocaleString()}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" mt={2}>
              <TextField
                select
                size="small"
                label="Rows"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                SelectProps={{ native: true }}
                sx={{ width: 100 }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </TextField>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </Button>
              <Typography>Page {page} of {totalPages}</Typography>
              <Button
                disabled={page * limit >= sortedRows.length}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
