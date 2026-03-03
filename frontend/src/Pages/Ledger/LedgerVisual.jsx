// import {
//   Grid,
//   Paper,
//   Typography,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function LedgerVisual({ rows, title }) {
//   const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
//   const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
//   const balance = rows.length ? rows[rows.length - 1].balance : 0;

//   return (
//     <Grid container spacing={2} mb={3}>
//       {/* SUMMARY CARDS */}
//       <Grid item xs={12} md={4}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="caption">Total Debit</Typography>
//           <Typography variant="h6">₹{totalDebit.toFixed(2)}</Typography>
//         </Paper>
//       </Grid>

//       <Grid item xs={12} md={4}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="caption">Total Credit</Typography>
//           <Typography variant="h6">₹{totalCredit.toFixed(2)}</Typography>
//         </Paper>
//       </Grid>

//       <Grid item xs={12} md={4}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="caption">Closing Balance</Typography>
//           <Typography
//             variant="h6"
//             color={balance >= 0 ? "success.main" : "error.main"}
//           >
//             ₹{balance.toFixed(2)}
//           </Typography>
//         </Paper>
//       </Grid>

//       {/* CHART */}
//       <Grid item xs={12}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="subtitle2" mb={1}>
//             {title} – Debit vs Credit
//           </Typography>

//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={rows}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="debit" fill="#d32f2f" />
//               <Bar dataKey="credit" fill="#2e7d32" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// }


import { Grid, Paper, Typography } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function LedgerCharts({ rows, colors, title }) {
  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);

  const pieData = [
    { name: "Debit", value: totalDebit },
    { name: "Credit", value: totalCredit },
  ];

  return (
    <Grid container spacing={2} mb={3}>
      {/* BAR */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">{title} Trend</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rows}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="debit" fill={colors.debit} />
              <Bar dataKey="credit" fill={colors.credit} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* PIE */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Debit vs Credit</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" label>
                <Cell fill={colors.debit} />
                <Cell fill={colors.credit} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
