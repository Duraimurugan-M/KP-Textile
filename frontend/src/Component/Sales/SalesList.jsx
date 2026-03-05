// import {
//   Paper,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Grid,
//   Divider,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { useState } from "react";

// export default function SalesList({ sales }) {
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState(null);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const viewSale = (sale) => {
//     setSelected(sale);
//     setOpen(true);
//   };

//   const totalQty = (sale) =>
//     sale.items.reduce((sum, i) => sum + i.qty, 0);

//   return (
//     <>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" mb={2}>
//           Sales History
//         </Typography>

//         <TableContainer sx={{ overflowX: "auto" }}>
//           <Table size="small" sx={{ minWidth: 900 }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell align="center">Items</TableCell>
//                 <TableCell align="center">Total Qty</TableCell>
//                 <TableCell align="right">Grand Total</TableCell>
//                 <TableCell align="center">Bill</TableCell>
//                 <TableCell align="center">Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {sales.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     No sales found
//                   </TableCell>
//                 </TableRow>
//               )}

//               {sales.map((s) => (
//                 <TableRow key={s.id} hover>
//                   <TableCell>{s.date}</TableCell>
//                   <TableCell>{s.customer}</TableCell>
//                   <TableCell align="center">{s.items.length}</TableCell>
//                   <TableCell align="center">{totalQty(s)}</TableCell>
//                   <TableCell align="right">
//                     ₹{s.grandTotal.toFixed(2)}
//                   </TableCell>
//                   <TableCell align="center">
//   <Button
//     size="small"
//     variant="outlined"
//     onClick={() => viewSale(s)}
//   >
//     Bill
//   </Button>
// </TableCell>

// <TableCell align="center">
//   <Button size="small" onClick={() => viewSale(s)}>
//     View
//   </Button>
// </TableCell>

//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* 🔍 SALE DETAILS MODAL */}
//       {selected && (
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           fullWidth
//           maxWidth="lg"
//         >
//           <DialogTitle>Sale Details</DialogTitle>

//           <DialogContent dividers>
//             {/* HEADER INFO */}
//             <Grid container spacing={2} mb={2}>
//               <Grid item xs={12} md={4}>
//                 <Typography>
//                   <b>Customer:</b> {selected.customer}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography>
//                   <b>Date:</b> {selected.date}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography>
//                   <b>GST Mode:</b>{" "}
//                   {selected.gstMode === "with"
//                     ? "With GST"
//                     : "Without GST"}
//                 </Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ mb: 2 }} />

//             {/* ✅ RESPONSIVE TABLE CONTAINER */}
//             <TableContainer
//               sx={{
//                 overflowX: "auto",
//                 maxWidth: "100%",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{ minWidth: isMobile ? 700 : 1000 }}
//               >
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Product</TableCell>
//                     <TableCell align="center">Qty</TableCell>
//                     <TableCell align="right">Price</TableCell>
//                     <TableCell align="right">CGST</TableCell>
//                     <TableCell align="right">SGST</TableCell>
//                     <TableCell align="right">IGST</TableCell>
//                     <TableCell align="right">Line Total</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {selected.items.map((i, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{i.productName}</TableCell>
//                       <TableCell align="center">{i.qty}</TableCell>
//                       <TableCell align="right">₹{i.price}</TableCell>
//                       <TableCell align="right">
//                         ₹{i.cgstAmount.toFixed(2)}
//                       </TableCell>
//                       <TableCell align="right">
//                         ₹{i.sgstAmount.toFixed(2)}
//                       </TableCell>
//                       <TableCell align="right">
//                         ₹{i.igstAmount.toFixed(2)}
//                       </TableCell>
//                       <TableCell align="right">
//                         ₹{i.total.toFixed(2)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <Divider sx={{ my: 2 }} />

//             <Typography align="right" variant="h6">
//               Grand Total: ₹{selected.grandTotal.toFixed(2)}
//             </Typography>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }


import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@mui/material";

export default function SalesList({ sales }) {

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const getItemNames = (items) => {
    return items
      .map((i) => {

        const name = i.product?.name || "Product";
        const code = i.product?.productCode || "";

        return `${name} (${code})`;

      })
      .join(", ");
  };

  const getTotalQty = (items) => {
    return items.reduce((sum, i) => sum + i.qty, 0);
  };

  return (

    <Paper sx={{ p:3 }}>

      <Typography variant="h6" mb={2}>
        Sales History
      </Typography>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>Bill</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>GST</TableCell>
            <TableCell>Gross Total</TableCell>
            <TableCell>Grand Total</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {sales.map((sale,index)=>(

            <TableRow key={sale._id}>

              <TableCell>
                #{index+1}
              </TableCell>

              <TableCell>
                {formatDate(sale.createdAt)}
              </TableCell>

              <TableCell>
                {sale.customer?.name || "Walk-in"}
              </TableCell>

              <TableCell sx={{ maxWidth:300 }}>
                {getItemNames(sale.items)}
              </TableCell>

              <TableCell>
                {getTotalQty(sale.items)}
              </TableCell>

              <TableCell>
                {sale.gstMode === "without" ? "Bill" : "GST"}
              </TableCell>

              <TableCell>
                ₹{sale.grossTotal}
              </TableCell>

              <TableCell>
                <b>₹{sale.grandTotal}</b>
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>

  );

}