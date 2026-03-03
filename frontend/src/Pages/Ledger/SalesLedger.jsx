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

const COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#6a1b9a", "#c2185b"];

export default function SalesLedger() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [salesTable, setSalesTable] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    // TABLE DATA
    setSalesTable(
      sales.map((s) => ({
        date: s.date,
        customer: s.customer,
        items: s.items.length,
        qty: s.items.reduce((a, b) => a + b.qty, 0),
        total: s.grandTotal,
      }))
    );

    // MONTHLY SALES
    const monthMap = {};
    sales.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.toLocaleString("default", {
        month: "short",
      })} ${d.getFullYear()}`;

      monthMap[key] = (monthMap[key] || 0) + s.grandTotal;
    });

    setMonthlySales(
      Object.keys(monthMap).map((m) => ({
        month: m,
        amount: monthMap[m],
      }))
    );

    // CUSTOMER SALES
    const custMap = {};
    sales.forEach((s) => {
      custMap[s.customer] =
        (custMap[s.customer] || 0) + s.grandTotal;
    });

    setCustomerSales(
      Object.keys(custMap).map((c) => ({
        name: c,
        value: custMap[c],
      }))
    );
  }, []);

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>

{/* 🔷 PAGE HEADING */}
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
        {/* 📈 MONTHLY SALES TREND */}
        <Grid item xs={12} lg={6} sx={{width:500}}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6" mb={2}>
              Monthly Sales Trend
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlySales}
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
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#1976d2"
                  fill="#bbdefb"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 🍩 CUSTOMER-WISE SALES */}
        <Grid item xs={12} lg={6} sx={{width:500}}>
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

        {/* 📋 SALES TABLE */}
        <Grid item xs={12} sx={{width:1100}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Sales Ledger (Detailed)
            </Typography>

            <TableContainer
              sx={{
                overflowX: isMobile ? "auto" : "hidden",
              }}
            >
              <Table
                size="small"
                sx={{ minWidth: isMobile ? 700 : "100%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="center">Items</TableCell>
                    <TableCell align="center">Total Qty</TableCell>
                    <TableCell align="right">
                      Grand Total (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {salesTable.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.customer}</TableCell>
                      <TableCell align="center">{s.items}</TableCell>
                      <TableCell align="center">{s.qty}</TableCell>
                      <TableCell align="right">
                        ₹{s.total.toFixed(2)}
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
