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
  CartesianGrid,
  Line,
  LineChart,
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

export default function VendorLedger() {
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-dateRaw");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await customFetch.get("/purchases");
        const purchases = data?.purchases || [];

        const mapped = purchases
          .map((purchase) => {
            const purchaseItemsList = (purchase.items || [])
              .map((item) => {
                const nameFromProduct =
                  typeof item.product === "object" ? item.product?.name : "";
                const codeFromProduct =
                  typeof item.product === "object" ? item.product?.productCode : "";
                const fallbackName = item.productName || item.name || item.productCode || "";

                return (nameFromProduct || codeFromProduct || fallbackName || "").trim();
              })
              .filter(Boolean);
            const productCodeList = (purchase.items || [])
              .map((item) => {
                const codeFromProduct =
                  typeof item.product === "object" ? item.product?.productCode : "";
                const fallbackCode = item.productCode || "";
                return (codeFromProduct || fallbackCode || "").trim();
              })
              .filter(Boolean);

            const total = (purchase.items || []).reduce(
              (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
              0
            );

            return {
              id: purchase._id,
              dateRaw: purchase.createdAt,
              date: formatDateTime(purchase.createdAt),
              vendor: purchase.supplier?.name || "Unknown",
              purchaseItems: purchaseItemsList.join(", ") || `${purchase.items?.length || 0} item(s)`,
              productCodes: productCodeList.join(", ") || "-",
              items: (purchase.items || []).length,
              qty: (purchase.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0),
              debit: total,
            };
          })
          .sort((a, b) => new Date(a.dateRaw) - new Date(b.dateRaw));

        let runningBalance = 0;
        const rows = mapped.map((row) => {
          runningBalance += row.debit;
          return { ...row, balance: runningBalance };
        });

        setAllRows(rows);
      } catch {
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
        searchFields: ["vendor", "purchaseItems", "productCodes"],
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

  const vendorSummary = useMemo(() => {
    const map = {};

    filteredRows.forEach((row) => {
      map[row.vendor] = (map[row.vendor] || 0) + row.debit;
    });

    return Object.keys(map).map((name) => ({ name, value: map[name] }));
  }, [filteredRows]);

  const topVendor = useMemo(() => {
    if (!vendorSummary.length) return null;
    return vendorSummary.reduce((a, b) => (b.value > a.value ? b : a));
  }, [vendorSummary]);

  const topFive = [...vendorSummary].sort((a, b) => b.value - a.value).slice(0, 5);

  const trendData = useMemo(() => {
    const map = {};

    filteredRows.forEach((row) => {
      const key = new Date(row.dateRaw).toLocaleDateString();
      map[key] = (map[key] || 0) + row.debit;
    });

    return Object.keys(map).map((date) => ({ date, amount: map[date] }));
  }, [filteredRows]);

  const exportColumns = [
    { label: "Date", key: "date" },
    { label: "Supplier", key: "vendor" },
    { label: "Purchase Items", key: "purchaseItems" },
    { label: "Product Code", key: "productCodes" },
    { label: "Items", key: "items" },
    { label: "Total Qty", key: "qty" },
    { label: "Debit", value: (row) => row.debit.toFixed(2) },
    { label: "Balance", value: (row) => row.balance.toFixed(2) },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {topVendor && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#fff3e0" }}>
              <Typography variant="subtitle2">Top Supplier</Typography>
              <Typography variant="h4" color="warning.main">
                {topVendor.name}
              </Typography>
              <Typography variant="h6">
                Total Purchase: Rs {topVendor.value.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Top 5 Suppliers by Purchase
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFive} margin={{ top: 20, bottom: 60 }}>
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f57c00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Purchase Trend (Date-wise)
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#6a1b9a" strokeWidth={3} />
              </LineChart>
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
              <Typography variant="h6">Supplier Purchase Ledger</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    exportLedgerToExcel({
                      rows: sortedRows,
                      columns: exportColumns,
                      title: "Supplier Ledger",
                      fileName: "vendor-ledger",
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
                      title: "Supplier Ledger",
                      fileName: "vendor-ledger",
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
                placeholder="Search supplier, items or code"
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
                <option value="-debit">Debit High-Low</option>
                <option value="debit">Debit Low-High</option>
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

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table
                size="small"
                sx={{
                  minWidth: isMobile ? 1120 : 1310,
                  tableLayout: "fixed",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 50 }}>
                      #
                    </TableCell>
                    <TableCell sx={{ width: 210, whiteSpace: "nowrap" }}>Date</TableCell>
                    <TableCell sx={{ width: 150, whiteSpace: "nowrap" }}>Supplier</TableCell>
                    <TableCell sx={{ width: 260 }}>Purchase Items</TableCell>
                    <TableCell sx={{ width: 140 }}>Product Code</TableCell>
                    <TableCell align="center" sx={{ width: 80 }}>
                      Items
                    </TableCell>
                    <TableCell align="center" sx={{ width: 95 }}>
                      Total Qty
                    </TableCell>
                    <TableCell align="right" sx={{ width: 140, whiteSpace: "nowrap" }}>
                      Debit (Rs)
                    </TableCell>
                    <TableCell align="right" sx={{ width: 145, whiteSpace: "nowrap" }}>
                      Balance (Rs)
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
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.date}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.vendor}</TableCell>
                      <TableCell>{row.purchaseItems}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                        {row.productCodes}
                      </TableCell>
                      <TableCell align="center">{row.items}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
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
