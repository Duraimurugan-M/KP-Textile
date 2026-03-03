import { useState, useEffect } from "react";
import { Container, Typography, Paper } from "@mui/material";
import InventorySummary from "../../Component/inventory/InventorySummary";
import InventoryTable from "../../Component/inventory/InvnentoryTable";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Inventory</Typography>

      <InventorySummary products={products} />

      <Paper sx={{ p: 3, mt: 3 }}>
        <InventoryTable products={products} />
      </Paper>
    </Container>
  );
}
