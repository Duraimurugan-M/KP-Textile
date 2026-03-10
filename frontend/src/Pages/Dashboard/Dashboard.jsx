import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import customFetch from "../../utils/customFetch";

const CUSTOMER_COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#6a1b9a", "#d32f2f"];
const SUPPLIER_COLORS = ["#00897b", "#5e35b1", "#ef6c00", "#c62828", "#3949ab"];

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function DashboardLedger() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyPurchase, setMonthlyPurchase] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [vendorPurchase, setVendorPurchase] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesRes, purchasesRes, customersRes, vendorsRes] = await Promise.all([
          customFetch.get("/sales"),
          customFetch.get("/purchases"),
          customFetch.get("/customers", { params: { page: 1, limit: 100000 } }),
          customFetch.get("/vendors", { params: { page: 1, limit: 100000 } }),
        ]);

        const s = salesRes.data?.sales || [];
        const p = purchasesRes.data?.purchases || [];

        setSales(s);
        setPurchases(p);
        setCustomersCount(customersRes.data?.total || 0);
        setVendorsCount(vendorsRes.data?.total || 0);

        const salesMonth = {};
        const custMap = {};
        s.forEach((x) => {
          const d = new Date(x.createdAt);
          if (Number.isNaN(d.getTime())) return;
          const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
          const total = Number(x.grandTotal || 0);
          const customerName = x.customer?.name || "Walk-in";
          salesMonth[key] = (salesMonth[key] || 0) + total;
          custMap[customerName] = (custMap[customerName] || 0) + total;
        });

        setMonthlySales(Object.keys(salesMonth).map((m) => ({ month: m, amount: salesMonth[m] })));
        setCustomerSales(Object.keys(custMap).map((c) => ({ name: c, value: custMap[c] })));

        const purMonth = {};
        const vendorMap = {};
        p.forEach((x) => {
          const d = new Date(x.createdAt);
          if (Number.isNaN(d.getTime())) return;
          const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
          const total =
            Number(x.totalAmount || 0) ||
            (x.items || []).reduce(
              (sum, i) => sum + Number(i.qty || 0) * Number(i.price || 0),
              0
            );
          const supplierName = x.supplier?.name || "Unknown";
          purMonth[key] = (purMonth[key] || 0) + total;
          vendorMap[supplierName] = (vendorMap[supplierName] || 0) + total;
        });

        setMonthlyPurchase(Object.keys(purMonth).map((m) => ({ month: m, amount: purMonth[m] })));
        setVendorPurchase(Object.keys(vendorMap).map((v) => ({ name: v, value: vendorMap[v] })));
      } catch {
        setSales([]);
        setPurchases([]);
        setCustomersCount(0);
        setVendorsCount(0);
        setMonthlySales([]);
        setMonthlyPurchase([]);
        setCustomerSales([]);
        setVendorPurchase([]);
      }
    };

    fetchDashboardData();
  }, []);

  const totalSales = sales.reduce((s, x) => s + Number(x.grandTotal || 0), 0);
  const totalPurchase = purchases.reduce(
    (s, p) =>
      s +
      (Number(p.totalAmount || 0) ||
        (p.items || []).reduce((a, i) => a + Number(i.qty || 0) * Number(i.price || 0), 0)),
    0
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Sales & Purchase overview
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3} mb={3}>
        {[
          { label: "Total Sales", value: totalSales, color: "#1976d2" },
          { label: "Total Purchase", value: totalPurchase, color: "#d32f2f" },
          { label: "Customers", value: customersCount, color: "#2e7d32" },
          { label: "Suppliers", value: vendorsCount, color: "#f57c00" },
        ].map((c, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} sx={{ width: 250 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2">{c.label}</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: c.color }}>
                {c.label === "Customers" || c.label === "Suppliers"
                  ? c.value
                  : `${"\u20B9"}${typeof c.value === "number" ? c.value.toFixed(2) : c.value}`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MONTHLY CHARTS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6">Monthly Sales</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="amount" stroke="#1976d2" fill="#bbdefb" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6">Monthly Purchase</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPurchase}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="amount" stroke="#d32f2f" fill="#ffcdd2" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* PIE CHARTS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6">Customer-wise Sales</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSales}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 90 : 120}
                  label={!isMobile}
                >
                  {customerSales.map((_, i) => (
                    <Cell key={i} fill={CUSTOMER_COLORS[i % CUSTOMER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6">Supplier-wise Purchase</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorPurchase}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 90 : 120}
                  label={!isMobile}
                >
                  {vendorPurchase.map((_, i) => (
                    <Cell key={i} fill={SUPPLIER_COLORS[i % SUPPLIER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLES */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Sales Ledger
            </Typography>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Total ({"\u20B9"})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{formatDateTime(s.createdAt)}</TableCell>
                      <TableCell>{s.customer?.name || "Walk-in"}</TableCell>
                      <TableCell align="right">
                        {"\u20B9"}
                        {Number(s.grandTotal || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: 500 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Purchase Ledger
            </Typography>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total ({"\u20B9"})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>{formatDateTime(p.createdAt)}</TableCell>
                      <TableCell>{p.supplier?.name || "Unknown"}</TableCell>
                      <TableCell align="right">
                        {"\u20B9"}
                        {(
                          Number(p.totalAmount || 0) ||
                          (p.items || []).reduce(
                            (s, i) => s + Number(i.qty || 0) * Number(i.price || 0),
                            0
                          )
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
