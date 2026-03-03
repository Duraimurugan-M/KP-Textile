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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#6a1b9a", "#c2185b"];

export default function CustomerLedger() {
  const [ledgerRows, setLedgerRows] = useState([]);
  const [summary, setSummary] = useState([]);
  const [topCustomer, setTopCustomer] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    let running = 0;
    const ledger = sales.map((s) => {
      running += s.grandTotal;
      return {
        date: s.date,
        customer: s.customer,
        particular: `Sale #${s.id}`,
        debit: s.grandTotal,
        balance: running,
      };
    });

    setLedgerRows(ledger);

    const map = {};
    sales.forEach((s) => {
      map[s.customer] = (map[s.customer] || 0) + s.grandTotal;
    });

    const summaryArr = Object.keys(map).map((k) => ({
      name: k,
      value: map[k],
    }));

    setSummary(summaryArr);

    if (summaryArr.length) {
      setTopCustomer(
        summaryArr.reduce((a, b) => (b.value > a.value ? b : a))
      );
    }
  }, []);

  const topFive = [...summary]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* 🔝 TOP CUSTOMER */}
        {topCustomer && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#e3f2fd" }}>
              <Typography variant="subtitle2">
                Top Customer
              </Typography>
              <Typography variant="h4" color="primary">
                {topCustomer.name}
              </Typography>
              <Typography variant="h6">
                Total Sales: ₹{topCustomer.value.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* 📊 TOP 5 BAR CHART (FIXED) */}
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
                <Bar
                  dataKey="value"
                  fill="#1976d2"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 🥧 PIE CHART */}
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

        {/* 📋 LEDGER TABLE */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Customer Sales Ledger
            </Typography>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table
                size="small"
                sx={{ minWidth: isMobile ? 700 : 1200 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Particular</TableCell>
                    <TableCell align="right">
                      Debit (₹)
                    </TableCell>
                    <TableCell align="right">
                      Balance (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ledgerRows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{r.particular}</TableCell>
                      <TableCell align="right">
                        ₹{r.debit.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₹{r.balance.toFixed(2)}
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
