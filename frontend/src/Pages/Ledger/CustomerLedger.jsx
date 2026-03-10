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
  Bar,
  BarChart,
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

const pad = (n, width = 2) => String(n).padStart(width, "0");

const buildInvoiceNo = (date, serial, withPrefix = true) => {
  const yy = pad(date.getFullYear() % 100, 2);
  const mm = pad(date.getMonth() + 1, 2);
  const seq = pad(serial, 3);
  return withPrefix ? `YS${yy}${mm}${seq}` : `${yy}${mm}${seq}`;
};

export default function CustomerLedger() {
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-dateRaw");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showOtherParticulars, setShowOtherParticulars] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await customFetch.get("/sales");
        const sales = data?.sales || [];

        const orderedSales = [...sales].sort((a, b) => {
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();
          if (ta !== tb) return ta - tb;
          return String(a._id || "").localeCompare(String(b._id || ""));
        });

        const monthModeCount = {};
        const mapped = orderedSales
          .map((sale) => {
            const saleDate = sale.createdAt ? new Date(sale.createdAt) : new Date();
            const nonGst = sale.gstMode === "without";
            const key = `${saleDate.getFullYear()}-${saleDate.getMonth()}-${nonGst ? "N" : "G"}`;
            monthModeCount[key] = (monthModeCount[key] || 0) + 1;

            const gross = Number(sale.grossTotal || 0);
            const discountAmount = Number(sale.discountTotal || 0);
            const discountPercent = gross > 0 ? (discountAmount / gross) * 100 : 0;

            return {
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
            particular: buildInvoiceNo(saleDate, monthModeCount[key], !nonGst),
            discountPercent,
            debit: Number(sale.grandTotal || 0),
          };
          })
          .sort((a, b) => new Date(a.dateRaw) - new Date(b.dateRaw));

        let running = 0;
        const ledger = mapped.map((row) => {
          running += row.debit;
          return { ...row, balance: running };
        });

        setAllRows(ledger);
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

  const filteredRows = useMemo(() => {
    const baseRows = filterLedgerRows({
      rows: allRows,
      search,
      fromDate,
      toDate,
      searchFields: ["customer", "products", "productCodes", "particular"],
      exactFilters: { customer: selectedCustomer },
    });

    return baseRows.filter((row) => {
      const isYsParticular = String(row.particular || "")
        .trim()
        .toUpperCase()
        .startsWith("YS");
      return showOtherParticulars ? !isYsParticular : isYsParticular;
    });
  }, [allRows, search, fromDate, toDate, selectedCustomer, showOtherParticulars]);

  const sortedRows = useMemo(
    () => sortLedgerRows(filteredRows, sort),
    [filteredRows, sort]
  );

  const pagedRows = useMemo(
    () => paginateRows(sortedRows, page, limit),
    [sortedRows, page, limit]
  );

  const summary = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      map[row.customer] = (map[row.customer] || 0) + row.debit;
    });
    return Object.keys(map).map((name) => ({ name, value: map[name] }));
  }, [filteredRows]);

  const topCustomer = useMemo(() => {
    if (!summary.length) return null;
    return summary.reduce((a, b) => (b.value > a.value ? b : a));
  }, [summary]);

  const topFive = [...summary].sort((a, b) => b.value - a.value).slice(0, 5);

  const exportColumns = [
    { label: "Date", key: "date" },
    { label: "Customer", key: "customer" },
    { label: "Products", key: "products" },
    { label: "Product Code", key: "productCodes" },
    { label: "Items", key: "items" },
    { label: "Total Qty", key: "qty" },
    { label: "Particular", key: "particular" },
    { label: "Discount %", value: (row) => row.discountPercent.toFixed(2) },
    { label: "Debit", value: (row) => row.debit.toFixed(2) },
    { label: "Balance", value: (row) => row.balance.toFixed(2) },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {topCustomer && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#e3f2fd" }}>
              <Typography variant="subtitle2">Top Customer</Typography>
              <Typography variant="h4" color="primary">
                {topCustomer.name}
              </Typography>
              <Typography variant="h6">
                Total Sales: Rs {topCustomer.value.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Top 5 Customers by Sales
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topFive}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 60,
                }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  tick={{
                    fontSize: isMobile ? 10 : 12,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Customer Sales Distribution
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 90 : 120}
                  label={!isMobile}
                >
                  {summary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">Customer Sales Ledger</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    exportLedgerToExcel({
                      rows: sortedRows,
                      columns: exportColumns,
                      title: "Customer Ledger",
                      fileName: "customer-ledger",
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
                      title: "Customer Ledger",
                      fileName: "customer-ledger",
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
                placeholder="Search customer, product, code or invoice"
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
                <option value="-debit">Debit High-Low</option>
                <option value="debit">Debit Low-High</option>
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
                sx={{ width: { xs: "100%", sm: 170 }, maxWidth: "100%" }}
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

            <Typography variant="h6" mb={2}>
              Filtered Results: {sortedRows.length}
            </Typography>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table
                size="small"
                sx={{
                  minWidth: isMobile ? 1200 : 1340,
                  tableLayout: "fixed",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 44 }}>
                      <Checkbox
                        checked={showOtherParticulars}
                        onChange={(e) => {
                          setPage(1);
                          setShowOtherParticulars(e.target.checked);
                        }}
                        inputProps={{ "aria-label": "toggle particular filter" }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ width: 180, whiteSpace: "nowrap" }}>Date</TableCell>
                    <TableCell sx={{ width: 120, whiteSpace: "nowrap" }}>Customer</TableCell>
                    <TableCell sx={{ width: 220 }}>Products</TableCell>
                    <TableCell sx={{ width: 130, whiteSpace: "nowrap" }}>Product Code</TableCell>
                    <TableCell align="center" sx={{ width: 70 }}>
                      Items
                    </TableCell>
                    <TableCell align="center" sx={{ width: 90 }}>
                      Total Qty
                    </TableCell>
                    <TableCell sx={{ width: 120, whiteSpace: "nowrap" }}>Particular</TableCell>
                    <TableCell align="right" sx={{ width: 90, whiteSpace: "nowrap" }}>
                      Discount %
                    </TableCell>
                    <TableCell align="right" sx={{ width: 130, whiteSpace: "nowrap" }}>
                      Debit (Rs)
                    </TableCell>
                    <TableCell align="right" sx={{ width: 130, whiteSpace: "nowrap" }}>
                      Balance (Rs)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        No ledger records found
                      </TableCell>
                    </TableRow>
                  )}

                  {pagedRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">#{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.date}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.customer}</TableCell>
                      <TableCell>{row.products}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.productCodes}</TableCell>
                      <TableCell align="center">{row.items}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.particular}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {row.discountPercent.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        Rs {row.debit.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        Rs {row.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </Button>
              <Typography>Page {page}</Typography>
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
