// import { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
// } from "@mui/material";

// export default function SalesPage() {
//   const [sales, setSales] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);

//   // Load sales
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("sales")) || [];
//     setSales(data);
//   }, []);

//   const viewItems = (sale) => {
//     setSelectedSale(sale);
//     setOpen(true);
//   };

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4">Sales History</Typography>

//       <Paper sx={{ p: 2, mt: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Customer</TableCell>
//               <TableCell>Total</TableCell>
//               <TableCell>Items</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {sales.map((s) => (
//               <TableRow key={s.id}>
//                 <TableCell>{s.date}</TableCell>
//                 <TableCell>{s.customer || "Walk-in"}</TableCell>
//                 <TableCell>₹{s.total}</TableCell>
//                 <TableCell>
//                   <Button onClick={() => viewItems(s)}>View</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* Items Dialog */}
//       {selectedSale && (
//         <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
//           <DialogTitle>Sold Items</DialogTitle>

//           <DialogContent>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Qty</TableCell>
//                   <TableCell>Price</TableCell>
//                   <TableCell>Total</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {selectedSale.items.map((i, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>{i.name}</TableCell>
//                     <TableCell>{i.qty}</TableCell>
//                     <TableCell>₹{i.price}</TableCell>
//                     <TableCell>₹{i.price * i.qty}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </DialogContent>
//         </Dialog>
//       )}
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import { Container, Typography, Stack } from "@mui/material";
import SalesForm from "../../Component/Sales/SalesForm";
import SalesList from "../../Component/Sales/SalesList";

export default function SalesModule() {
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || []
  );

  const [sales, setSales] = useState(
    () => JSON.parse(localStorage.getItem("sales")) || []
  );

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleSale = ({ customer, gstMode, items, grandTotal }) => {
    const sale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      customer,
      gstMode,
      items,
      grandTotal,
    };

    setSales((prev) => [sale, ...prev]);

    // 🔻 Reduce stock
    setProducts((prev) =>
      prev.map((p) => {
        const sold = items.find((i) => i.productId === p.id);
        return sold ? { ...p, stock: p.stock - sold.qty } : p;
      })
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Sales
      </Typography>

      <Stack spacing={3}>
        <SalesForm products={products} onSale={handleSale} />
        <SalesList sales={sales} />
      </Stack>
    </Container>
  );
}
