import { useState, useEffect } from "react";
import { Container, Typography, Paper } from "@mui/material";
import InventorySummary from "../../Component/inventory/InventorySummary";
import InventoryTable from "../../Component/inventory/InvnentoryTable";
import InventoryMovement from "../../Component/inventory/InventoryMovement";
import customFetch from "../../utils/customFetch";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [productsRes, purchasesRes] = await Promise.all([
          customFetch.get("products"),
          customFetch.get("purchases"),
        ]);

        setProducts(productsRes.data?.products || []);
        setPurchases(purchasesRes.data?.purchases || []);
      } catch (error) {
        console.error("Failed to load inventory data:", error);
        setProducts([]);
        setPurchases([]);
      }
    };

    fetchInventoryData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Inventory</Typography>

      <InventorySummary products={products} purchases={purchases} />

      <Paper sx={{ p: 3, mt: 3 }}>
        <InventoryTable products={products} />
      </Paper>

      <InventoryMovement products={products} purchases={purchases} />
    </Container>
  );
}
