import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
import {
  exportLedgerToExcel,
  exportLedgerToPdf,
  filterLedgerRows,
  formatDateTime,
  paginateRows,
  sortLedgerRows,
} from "./ledgerHelpers";

const COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#6a1b9a", "#c2185b"];

export default function SalesLedger() {
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-dateRaw");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showWithoutGst, setShowWithoutGst] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const amountPrefix = showWithoutGst ? "Rs " : "₹";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await customFetch.get("/sales");
        const sales = data?.sales || [];

        const rows = sales.map((sale) => ({
          id: sale._id,
          dateRaw: sale.createdAt,
          date: formatDateTime(sale.createdAt),
          customer: sale.customer?.name || "Walk-in",
          products:
            (sale.items || [])
              .map((item) => item.product?.name || item.product?.productCode || "Product")
              .join(", ") || "-",
          productCodes:
            (sale.items || [])
              .map((item) => item.product?.productCode || item.productCode || "-")
              .join(", ") || "-",
          items: sale.items?.length || 0,
          qty: (sale.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0),
          total: Number(sale.grandTotal || 0),
          mode: sale.gstMode || "with",
        }));

        setAllRows(rows);
      } catch {
        setAllRows([]);
      }
    };

    fetchSales();
  }, []);

  const customerOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.customer))]
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
        searchFields: ["customer", "products", "productCodes"],
        exactFilters: {
          customer: selectedCustomer,
          mode: showWithoutGst ? "without" : "with",
        },
      }),
    [allRows, search, fromDate, toDate, selectedCustomer, showWithoutGst]
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

  const monthlySales = useMemo(() => {
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

  const customerSales = useMemo(() => {
    const map = {};

    filteredRows.forEach((row) => {
      map[row.customer] = (map[row.customer] || 0) + row.total;
    });

    return Object.keys(map).map((name) => ({ name, value: map[name] }));
  }, [filteredRows]);

  const exportColumns = [
    { label: "Date", key: "date" },
    { label: "Customer", key: "customer" },
    { label: "Products", key: "products" },
    { label: "Product Code", key: "productCodes" },
    { label: "Items", key: "items" },
    { label: "Total Qty", key: "qty" },
    { label: "Grand Total", value: (row) => row.total.toFixed(2) },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Sales Ledger
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Monthly trends, customer-wise distribution, and detailed sales history
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6" mb={2}>
              Monthly Sales Trend
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
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
                <Area type="monotone" dataKey="amount" stroke="#1976d2" fill="#bbdefb" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6" mb={2}>
              Customer-wise Sales
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSales}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={isMobile ? 55 : 75}
                  outerRadius={isMobile ? 95 : 120}
                  cx="50%"
                  cy="50%"
                  label={!isMobile}
                >
                  {customerSales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ width: 1100 }}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">Sales Ledger (Detailed)</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    exportLedgerToExcel({
                      rows: sortedRows,
                      columns: exportColumns,
                      title: "Sales Ledger",
                      fileName: "sales-ledger",
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
                      title: "Sales Ledger",
                      fileName: "sales-ledger",
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
                placeholder="Search customer or product"
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
                <option value="customer">Customer A-Z</option>
                <option value="-customer">Customer Z-A</option>
                <option value="-total">Total High-Low</option>
                <option value="total">Total Low-High</option>
                <option value="-qty">Qty High-Low</option>
                <option value="qty">Qty Low-High</option>
              </TextField>
              <TextField
                select
                size="small"
                label="Customer"
                value={selectedCustomer}
                onChange={(e) => {
                  setPage(1);
                  setSelectedCustomer(e.target.value);
                }}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: { xs: "100%", sm: 170 },
                  maxWidth: "100%",
                }}
              >
                <option value="">All</option>
                {customerOptions.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
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

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Filtered Results: {sortedRows.length}</Typography>
            </Stack>

            <TableContainer sx={{ overflowX: isMobile ? "auto" : "hidden" }}>
              <Table size="small" sx={{ minWidth: isMobile ? 700 : "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox
                        checked={showWithoutGst}
                        onChange={(e) => {
                          setPage(1);
                          setShowWithoutGst(e.target.checked);
                        }}
                        inputProps={{ "aria-label": "toggle gst mode" }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Product Code</TableCell>
                    <TableCell align="center">Items</TableCell>
                    <TableCell align="center">Total Qty</TableCell>
                    <TableCell align="right">Grand Total</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No sales records found
                      </TableCell>
                    </TableRow>
                  )}

                  {pagedRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell />
                      <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.products}</TableCell>
                      <TableCell>{row.productCodes}</TableCell>
                      <TableCell align="center">{row.items}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
                      <TableCell align="right">
                        {amountPrefix}
                        {row.total.toFixed(2)}
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
