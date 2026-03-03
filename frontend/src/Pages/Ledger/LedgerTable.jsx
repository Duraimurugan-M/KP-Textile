// import {
//   Paper,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
// } from "@mui/material";

// export default function LedgerTable({ title, rows }) {
//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" mb={2}>
//         {title}
//       </Typography>

//       <TableContainer>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Particular</TableCell>
//               <TableCell align="right">Debit (₹)</TableCell>
//               <TableCell align="right">Credit (₹)</TableCell>
//               <TableCell align="right">Balance (₹)</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No records found
//                 </TableCell>
//               </TableRow>
//             )}

//             {rows.map((r, i) => (
//               <TableRow key={i}>
//                 <TableCell>{r.date}</TableCell>
//                 <TableCell>{r.particular}</TableCell>
//                 <TableCell align="right">
//                   {r.debit ? r.debit.toFixed(2) : "-"}
//                 </TableCell>
//                 <TableCell align="right">
//                   {r.credit ? r.credit.toFixed(2) : "-"}
//                 </TableCell>
//                 <TableCell align="right">
//                   {r.balance.toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }


import {
  Table, TableBody, TableCell, TableHead,
  TableRow, TableContainer, Paper, Typography
} from "@mui/material";

export default function LedgerTable({ title, rows }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>{title}</Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Particular</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.particular}</TableCell>
                <TableCell align="right">
                  {r.debit ? `₹${r.debit}` : "-"}
                </TableCell>
                <TableCell align="right">
                  {r.credit ? `₹${r.credit}` : "-"}
                </TableCell>
                <TableCell align="right">₹{r.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
