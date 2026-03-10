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

const COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#6a1b9a", "#d32f2f"];

export default function DashboardLedger() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyPurchase, setMonthlyPurchase] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [vendorPurchase, setVendorPurchase] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("sales")) || [];
    const p = JSON.parse(localStorage.getItem("purchases")) || [];

    setSales(s);
    setPurchases(p);

    const salesMonth = {};
    const custMap = {};
    s.forEach((x) => {
      const d = new Date(x.date);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      salesMonth[key] = (salesMonth[key] || 0) + x.grandTotal;
      custMap[x.customer] = (custMap[x.customer] || 0) + x.grandTotal;
    });

    setMonthlySales(Object.keys(salesMonth).map((m) => ({ month: m, amount: salesMonth[m] })));
    setCustomerSales(Object.keys(custMap).map((c) => ({ name: c, value: custMap[c] })));

    const purMonth = {};
    const vendorMap = {};
    p.forEach((x) => {
      const total = x.items.reduce((s, i) => s + i.qty * i.price, 0);
      const d = new Date(x.date);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      purMonth[key] = (purMonth[key] || 0) + total;
      vendorMap[x.supplierName] = (vendorMap[x.supplierName] || 0) + total;
    });

    setMonthlyPurchase(Object.keys(purMonth).map((m) => ({ month: m, amount: purMonth[m] })));
    setVendorPurchase(Object.keys(vendorMap).map((v) => ({ name: v, value: vendorMap[v] })));
  }, []);

  const totalSales = sales.reduce((s, x) => s + x.grandTotal, 0);
  const totalPurchase = purchases.reduce(
    (s, p) => s + p.items.reduce((a, i) => a + i.qty * i.price, 0),
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
          { label: "Customers", value: customerSales.length, color: "#2e7d32" },
          { label: "Suppliers", value: vendorPurchase.length, color: "#f57c00" },
        ].map((c, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} sx={{width:250}}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2">{c.label}</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: c.color }}>
                ₹{typeof c.value === "number" ? c.value.toFixed(2) : c.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MONTHLY CHARTS */}
      <Grid container spacing={3} mb={3} >
        <Grid item xs={12} md={6} sx={{width:500}}>
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

        <Grid item xs={12} md={6} sx={{width:500}}>
          <Paper sx={{ p: 3, height: 360 }} >
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
      <Grid container spacing={3} mb={3} >
        <Grid item xs={12} md={6}sx={{width:500}}>
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
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}sx={{width:500}}>
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
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLES */}
      <Grid container spacing={3} >
        <Grid item xs={12} md={6}sx={{width:500}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Sales Ledger</Typography>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Total (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.customer}</TableCell>
                      <TableCell align="right">₹{s.grandTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{width:500}}>
          <Paper sx={{ p: 3 }} >
            <Typography variant="h6" mb={2}>Purchase Ledger</Typography>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.supplierName}</TableCell>
                      <TableCell align="right">
                        ₹{p.items.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}
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
