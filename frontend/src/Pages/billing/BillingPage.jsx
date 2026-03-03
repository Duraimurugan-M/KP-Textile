import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function BillingPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState("");

  // Load products
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  // Add to cart
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const existing = cart.find((c) => c.id === productId);

    if (existing) {
      setCart(
        cart.map((c) => (c.id === productId ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }
  };

  // Total
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Generate bill
  const generateBill = () => {
    if (cart.length === 0) return;

    // Reduce stock
    const updatedProducts = products.map((p) => {
      const item = cart.find((c) => c.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    });

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Save sale
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    const saleRecord = {
      id: Date.now(),
      customer,
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("sales", JSON.stringify([saleRecord, ...sales]));

    alert("Bill Generated!");

    setCart([]);
    setCustomer("");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Billing (POS)</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* LEFT - Add Products */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Select Product</Typography>

            <TextField
              select
              fullWidth
              onChange={(e) => addToCart(+e.target.value)}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} (Stock:{p.stock})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Customer Name"
              sx={{ mt: 2 }}
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* RIGHT - Cart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography>Cart</Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cart.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.qty}</TableCell>
                    <TableCell>₹{c.price}</TableCell>
                    <TableCell>₹{c.price * c.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography sx={{ mt: 2 }}>
              <b>Grand Total: ₹{total}</b>
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={generateBill}
            >
              Generate Bill
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
