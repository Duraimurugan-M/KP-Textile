// import { useState } from "react";
// import {
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";

// const emptyRow = () => ({
//   productId: "",
//   qty: "",
//   price: "",
//   supplier: "",
// });

// export default function PurchaseForm({ products, onPurchase }) {
//   const [rows, setRows] = useState([emptyRow()]);

//   const change = (i, e) => {
//     const r = [...rows];
//     r[i] = { ...r[i], [e.target.name]: e.target.value };
//     setRows(r);
//   };

//   const addRow = () => setRows([...rows, emptyRow()]);

//   const removeRow = (i) => {
//     const r = rows.filter((_, x) => x !== i);
//     setRows(r.length ? r : [emptyRow()]);
//   };

//   const submit = (e) => {
//     e.preventDefault();

//     const valid = rows.filter((r) => r.productId && r.qty);

//     if (valid.length) {
//       onPurchase(valid);
//     }

//     setRows([emptyRow()]);
//   };

//   return (
//     <>
//       <Typography variant="h6">Add Multiple Purchases</Typography>

//       <form onSubmit={submit}>
//         {rows.map((r, i) => (
//           <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
//             <Grid item xs={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Product"
//                 name="productId"
//                 value={r.productId}
//                 onChange={(e) => change(i, e)}
//               >
//                 {products.map((p) => (
//                   <MenuItem key={p.id} value={p.id}>
//                     {p.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             <Grid item xs={2}>
//               <TextField
//                 label="Qty"
//                 name="qty"
//                 type="number"
//                 fullWidth
//                 value={r.qty}
//                 onChange={(e) => change(i, e)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Price"
//                 name="price"
//                 type="number"
//                 fullWidth
//                 value={r.price}
//                 onChange={(e) => change(i, e)}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 label="Supplier"
//                 name="supplier"
//                 fullWidth
//                 value={r.supplier}
//                 onChange={(e) => change(i, e)}
//               />
//             </Grid>

//             <Grid item xs={1}>
//               <IconButton color="error" onClick={() => removeRow(i)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//         ))}

//         <Button startIcon={<AddIcon />} onClick={addRow}>
//           Add Row
//         </Button>

//         <Button variant="contained" type="submit">
//           Save All
//         </Button>
//       </form>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const emptyRow = () => ({
  productId: "",
  qty: "",
  price: "",
  supplierId: "",
  supplierName: "",
});

export default function PurchaseForm({ products, onPurchase }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [vendors, setVendors] = useState([]);

  // 🔹 LOAD SUPPLIERS FROM localStorage
  useEffect(() => {
    const stored = localStorage.getItem("vendors");
    if (stored) {
      setVendors(JSON.parse(stored));
    }
  }, []);

  const change = (i, e) => {
    const r = [...rows];

    if (e.target.name === "supplierId") {
      const selectedVendor = vendors.find(
        (v, index) => index.toString() === e.target.value
      );

      r[i] = {
        ...r[i],
        supplierId: e.target.value,
        supplierName: selectedVendor?.name || "",
      };
    } else {
      r[i] = { ...r[i], [e.target.name]: e.target.value };
    }

    setRows(r);
  };

  const addRow = () => setRows([...rows, emptyRow()]);

  const removeRow = (i) => {
    const r = rows.filter((_, x) => x !== i);
    setRows(r.length ? r : [emptyRow()]);
  };

  const submit = (e) => {
    e.preventDefault();

    const valid = rows.filter(
      (r) => r.productId && r.qty && r.supplierId
    );

    if (!valid.length) {
      alert("Please select product, quantity and supplier");
      return;
    }

    onPurchase(valid);
    setRows([emptyRow()]);
  };

  return (
    <>
      <Typography variant="h6" mb={2}>
        Add Multiple Purchases
      </Typography>

      <form onSubmit={submit}>
        {rows.map((r, i) => (
          <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
            {/* PRODUCT */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Product"
                name="productId"
                value={r.productId}
                onChange={(e) => change(i, e)}sx={{width:200}}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* QTY */}
            <Grid item xs={12} md={2}>
              <TextField
                label="Qty"
                name="qty"
                type="number"
                fullWidth
                value={r.qty}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            {/* PRICE */}
            <Grid item xs={12} md={2}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={r.price}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            {/* SUPPLIER DROPDOWN */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Supplier"
                name="supplierId"
                value={r.supplierId}
                onChange={(e) => change(i, e)}sx={{width:200}}
              >
                {vendors.length === 0 && (
                  <MenuItem disabled>No suppliers found</MenuItem>
                )}

                {vendors.map((v, index) => (
                  <MenuItem key={index} value={index.toString()}>
                    {v.name} ({v.mobile})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* DELETE */}
            <Grid item xs={12} md={1}>
              <IconButton color="error" onClick={() => removeRow(i)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<AddIcon />} onClick={addRow} sx={{ mr: 2 }}>
          Add Row
        </Button>

        <Button variant="contained" type="submit">
          Save All
        </Button>
      </form>
    </>
  );
}
