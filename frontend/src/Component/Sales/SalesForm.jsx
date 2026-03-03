import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const emptyRow = () => ({
  productId: "",
  productName: "",
  price: 0,
  qty: 1,

  cgstPercent: 0,
  sgstPercent: 0,
  igstPercent: 0,

  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,

  gstPercent: 0,
  total: 0,
});

export default function SalesForm({ products, onSale }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [gstMode, setGstMode] = useState("with"); // with | without

  // 🔹 Load customers
  useEffect(() => {
    setCustomers(JSON.parse(localStorage.getItem("customers")) || []);
  }, []);

  // 🔹 Central calculation
  const calculateRow = (row) => {
    const base = row.price * row.qty;

    if (gstMode === "without") {
      return {
        ...row,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        gstPercent: 0,
        total: base,
      };
    }

    const gstPercent =
      Number(row.cgstPercent) +
      Number(row.sgstPercent) +
      Number(row.igstPercent);

    const cgstAmount = (base * row.cgstPercent) / 100;
    const sgstAmount = (base * row.sgstPercent) / 100;
    const igstAmount = (base * row.igstPercent) / 100;

    return {
      ...row,
      gstPercent,
      cgstAmount,
      sgstAmount,
      igstAmount,
      total: base + cgstAmount + sgstAmount + igstAmount,
    };
  };

  // ✅ FIX: Recalculate rows when GST mode changes
  useEffect(() => {
    setRows((prev) => prev.map((r) => calculateRow(r)));
  }, [gstMode]);

  const change = (i, e) => {
    const { name, value } = e.target;
    const updated = [...rows];

    if (name === "productId") {
      const p = products.find((x) => x.id === +value);
      if (!p) return;

      updated[i] = calculateRow({
        ...updated[i],
        productId: p.id,
        productName: p.name,
        price: p.price,
        cgstPercent: gstMode === "with" ? (p.gstPercent || 0) / 2 : 0,
        sgstPercent: gstMode === "with" ? (p.gstPercent || 0) / 2 : 0,
        igstPercent: 0,
      });
    } else {
      updated[i] = calculateRow({
        ...updated[i],
        [name]: Number(value),
      });
    }

    setRows(updated);
  };

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (i) =>
    setRows(rows.filter((_, x) => x !== i) || [emptyRow()]);

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  const submit = () => {
    if (!customer || rows.length === 0) {
      alert("Customer and items required");
      return;
    }

    onSale({
      customer,
      gstMode,
      items: rows,
      grandTotal,
    });

    setRows([emptyRow()]);
    setCustomer("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Sales Entry
      </Typography>

      {/* HEADER */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}sx={{width:200}}
          >
            {customers.map((c, i) => (
              <MenuItem key={i} value={c.name}>
                {c.name} ({c.mobile})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="GST Mode"
            value={gstMode}
            onChange={(e) => setGstMode(e.target.value)}sx={{width:200}}
          >
            <MenuItem value="with">With GST</MenuItem>
            <MenuItem value="without">Without GST</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* ITEMS */}
      {rows.map((r, i) => (
        <Grid container spacing={2} key={i} sx={{ mb: 1 }}>
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

          <Grid item xs={6} md={1}>
            <TextField
              label="Qty"
              name="qty"
              type="number"
              value={r.qty}
              onChange={(e) => change(i, e)}sx={{width:200}}
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField label="Price" value={r.price} disabled sx={{width:200}}/>
          </Grid>

          <Grid item xs={4} md={1}>
            <TextField
              label="CGST %"
              name="cgstPercent"
              type="number"
              value={r.cgstPercent}
              disabled={gstMode === "without"}
              onChange={(e) => change(i, e)}sx={{width:200}}
            />
          </Grid>

          <Grid item xs={4} md={1}>
            <TextField
              label="SGST %"
              name="sgstPercent"
              type="number"
              value={r.sgstPercent}
              disabled={gstMode === "without"}
              onChange={(e) => change(i, e)}sx={{width:200}}
            />
          </Grid>

          <Grid item xs={4} md={1}>
            <TextField
              label="IGST %"
              name="igstPercent"
              type="number"
              value={r.igstPercent}
              disabled={gstMode === "without"}
              onChange={(e) => change(i, e)}sx={{width:200}}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Total"
              value={r.total.toFixed(2)}sx={{width:200}}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <IconButton color="error" onClick={() => removeRow(i)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button startIcon={<AddIcon />} onClick={addRow}>
        Add Item
      </Button>

      <Typography sx={{ mt: 2 }}>
        <b>Grand Total: ₹{grandTotal.toFixed(2)}</b>
      </Typography>

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Complete Sale
      </Button>
    </Paper>
  );
}
