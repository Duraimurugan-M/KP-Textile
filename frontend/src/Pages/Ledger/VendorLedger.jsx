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
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function VendorLedger() {
  const [ledgerRows, setLedgerRows] = useState([]);
  const [vendorSummary, setVendorSummary] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topVendor, setTopVendor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const purchases =
      JSON.parse(localStorage.getItem("purchases")) || [];

    let runningBalance = 0;
    const ledger = [];
    const vendorMap = {};
    const trendMap = {};

    purchases.forEach((p) => {
      const total = p.items.reduce(
        (s, i) => s + i.qty * i.price,
        0
      );

      runningBalance += total;

      ledger.push({
        date: p.date,
        vendor: p.supplierName,
        particular: `Purchase #${p.id}`,
        debit: total,
        balance: runningBalance,
      });

      vendorMap[p.supplierName] =
        (vendorMap[p.supplierName] || 0) + total;

      trendMap[p.date] = (trendMap[p.date] || 0) + total;
    });

    setLedgerRows(ledger);

    const vendorArr = Object.keys(vendorMap).map((v) => ({
      name: v,
      value: vendorMap[v],
    }));

    setVendorSummary(vendorArr);

    if (vendorArr.length) {
      setTopVendor(
        vendorArr.reduce((a, b) =>
          b.value > a.value ? b : a
        )
      );
    }

    const trendArr = Object.keys(trendMap).map((d) => ({
      date: d,
      amount: trendMap[d],
    }));

    setTrendData(trendArr);
  }, []);

  const topFive = [...vendorSummary]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* 🔝 TOP VENDOR */}
        {topVendor && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#fff3e0" }}>
              <Typography variant="subtitle2">
                Top Vendor
              </Typography>
              <Typography variant="h4" color="warning.main">
                {topVendor.name}
              </Typography>
              <Typography variant="h6">
                Total Purchase: ₹{topVendor.value.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* 📊 TOP 5 VENDORS BAR CHART */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Top 5 Vendors by Purchase
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topFive}
                margin={{ top: 20, bottom: 60 }}
              >
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
                <Bar
                  dataKey="value"
                  fill="#f57c00"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 📈 PURCHASE TREND LINE CHART */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" mb={2}>
              Purchase Trend (Date-wise)
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
  data={trendData}
  margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
>
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
  <Line
    type="monotone"
    dataKey="amount"
    stroke="#6a1b9a"
    strokeWidth={3}
  />
</LineChart>

            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 📋 VENDOR LEDGER TABLE */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Vendor Purchase Ledger
            </Typography>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table
                size="small"
                sx={{ minWidth: isMobile ? 700 : 1200 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Vendor</TableCell>
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
                  {ledgerRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No purchases found
                      </TableCell>
                    </TableRow>
                  )}

                  {ledgerRows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.vendor}</TableCell>
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
