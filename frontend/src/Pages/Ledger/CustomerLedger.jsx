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

export default function CustomerLedger() {
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-dateRaw");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await customFetch.get("/sales");
        const sales = data?.sales || [];

        const mapped = sales
          .map((sale) => ({
            id: sale._id,
            dateRaw: sale.createdAt,
            date: formatDateTime(sale.createdAt),
            customer: sale.customer?.name || "Walk-in",
            particular: `Sale #${sale._id?.slice(-6) || ""}`,
            debit: Number(sale.grandTotal || 0),
          }))
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

  const filteredRows = useMemo(
    () =>
      filterLedgerRows({
        rows: allRows,
        search,
        fromDate,
        toDate,
        searchFields: ["customer", "particular"],
        exactFilters: { customer: selectedCustomer },
      }),
    [allRows, search, fromDate, toDate, selectedCustomer]
  );

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
    { label: "Particular", key: "particular" },
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
                placeholder="Search customer or particular"
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
              <Table size="small" sx={{ minWidth: isMobile ? 700 : 1200 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Particular</TableCell>
                    <TableCell align="right">Debit (Rs)</TableCell>
                    <TableCell align="right">Balance (Rs)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No ledger records found
                      </TableCell>
                    </TableRow>
                  )}

                  {pagedRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.particular}</TableCell>
                      <TableCell align="right">Rs {row.debit.toFixed(2)}</TableCell>
                      <TableCell align="right">Rs {row.balance.toFixed(2)}</TableCell>
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
