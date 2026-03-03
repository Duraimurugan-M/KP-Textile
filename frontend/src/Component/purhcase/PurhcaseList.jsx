// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
//   TableContainer,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";
// import { useState } from "react";

// export default function PurchaseList({ purchases = [], products = [] }) {
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState(null);

//   const name = (id) => products.find((p) => p.id === id)?.name || "Unknown";

//   const view = (p) => {
//     setSelected(p);
//     setOpen(true);
//   };

//   return (
//     <>
//       <Typography variant="h6">Purchase History</Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Supplier</TableCell>
//               <TableCell>Total Items</TableCell>
//               <TableCell />
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {purchases.map((p) => (
//               <TableRow key={p.id}>
//                 <TableCell>{p.date}</TableCell>
//                 <TableCell>{p.supplier}</TableCell>
//                 <TableCell>{p.items.length}</TableCell>
//                 <TableCell>
//                   <Button onClick={() => view(p)}>View</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {selected && (
//         <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
//           <DialogTitle>Purchase Details</DialogTitle>

//           <DialogContent>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Product</TableCell>
//                   <TableCell>Qty</TableCell>
//                   <TableCell>Price</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {selected.items.map((i, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>{name(i.productId)}</TableCell>
//                     <TableCell>{i.qty}</TableCell>
//                     <TableCell>₹{i.price}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useState } from "react";

export default function PurchaseList({ purchases = [], products = [] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const name = (id) => products.find((p) => p.id === id)?.name || "Unknown";

  const view = (p) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <>
      <Typography variant="h6">Purchase History</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total Items</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
  {purchases.map((p) => (
    <TableRow key={p.id}>
      <TableCell>{p.date}</TableCell>

      {/* ✅ Correct supplier */}
      <TableCell>{p.supplierName}</TableCell>

      <TableCell>{p.items.length}</TableCell>

      <TableCell>
        <Button onClick={() => view(p)}>View</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {selected && (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Purchase Details</DialogTitle>

          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selected.items.map((i, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{name(i.productId)}</TableCell>
                    <TableCell>{i.qty}</TableCell>
                    <TableCell>₹{i.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
