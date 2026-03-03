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

const COLORS = ["#d32f2f", "#1976d2", "#2e7d32", "#f57c00", "#6a1b9a"];

export default function PurchaseLedger() {
  const [monthlyPurchase, setMonthlyPurchase] = useState([]);
  const [vendorPurchase, setVendorPurchase] = useState([]);
  const [purchaseTable, setPurchaseTable] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const purchases =
      JSON.parse(localStorage.getItem("purchases")) || [];

    /* ---------------- TABLE DATA ---------------- */
    setPurchaseTable(
      purchases.map((p) => ({
        date: p.date,
        vendor: p.supplierName,
        items: p.items.length,
        qty: p.items.reduce((s, i) => s + i.qty, 0),
        total: p.items.reduce(
          (s, i) => s + i.qty * i.price,
          0
        ),
      }))
    );

    /* ---------------- MONTHLY PURCHASE ---------------- */
    const monthMap = {};
    purchases.forEach((p) => {
      const d = new Date(p.date);
      const key = `${d.toLocaleString("default", {
        month: "short",
      })} ${d.getFullYear()}`;

      const total = p.items.reduce(
        (s, i) => s + i.qty * i.price,
        0
      );

      monthMap[key] = (monthMap[key] || 0) + total;
    });

    setMonthlyPurchase(
      Object.keys(monthMap).map((m) => ({
        month: m,
        amount: monthMap[m],
      }))
    );

    /* ---------------- VENDOR WISE PURCHASE ---------------- */
    const vendorMap = {};
    purchases.forEach((p) => {
      const total = p.items.reduce(
        (s, i) => s + i.qty * i.price,
        0
      );

      vendorMap[p.supplierName] =
        (vendorMap[p.supplierName] || 0) + total;
    });

    setVendorPurchase(
      Object.keys(vendorMap).map((v) => ({
        name: v,
        value: vendorMap[v],
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
            Purchase Ledger
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Monthly purchase trends, vendor-wise distribution, and
            detailed purchase history
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 📈 MONTHLY PURCHASE TREND */}
        <Grid item xs={12} lg={6} width={500}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6" mb={2}>
              Monthly Purchase Trend
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyPurchase}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 60,
                }}
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
                  stroke="#d32f2f"
                  fill="#ffcdd2"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 🍩 VENDOR-WISE PURCHASE */}
        <Grid item xs={12} lg={6} width={500}>
          <Paper sx={{ p: 3, height: 360 }}>
            <Typography variant="h6" mb={2}>
              Vendor-wise Purchase
            </Typography>

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
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 📋 PURCHASE TABLE */}
        <Grid item xs={12} width={1100}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Purchase Ledger (Detailed)
            </Typography>

            <TableContainer
              sx={{ overflowX: isMobile ? "auto" : "hidden" }}
            >
              <Table
                size="small"
                sx={{ minWidth: isMobile ? 700 : "100%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell align="center">
                      Items
                    </TableCell>
                    <TableCell align="center">
                      Total Qty
                    </TableCell>
                    <TableCell align="right">
                      Total Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {purchaseTable.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                      >
                        No purchases found
                      </TableCell>
                    </TableRow>
                  )}

                  {purchaseTable.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.vendor}</TableCell>
                      <TableCell align="center">
                        {p.items}
                      </TableCell>
                      <TableCell align="center">
                        {p.qty}
                      </TableCell>
                      <TableCell align="right">
                        ₹{p.total.toFixed(2)}
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
