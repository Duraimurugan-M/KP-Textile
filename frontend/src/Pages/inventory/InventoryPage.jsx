import { useState, useEffect } from "react";
import { Container, Typography, Paper } from "@mui/material";
import InventorySummary from "../../Component/inventory/InventorySummary";
import InventoryTable from "../../Component/inventory/InvnentoryTable";
import InventoryMovement from "../../Component/inventory/InventoryMovement";
import customFetch from "../../utils/customFetch";

export default function InventoryPage() {

  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);   // ✅ added

  useEffect(() => {

    const fetchInventoryData = async () => {

      try {

        const [productsRes, purchasesRes, salesRes] = await Promise.all([
          customFetch.get("products"),
          customFetch.get("purchases"),
          customFetch.get("sales"), // ✅ fetch sales
        ]);

        setProducts(productsRes.data?.products || []);
        setPurchases(purchasesRes.data?.purchases || []);
        setSales(salesRes.data?.sales || []); // ✅ store sales

      } catch (error) {

        console.error("Failed to load inventory data:", error);
        setProducts([]);
        setPurchases([]);
        setSales([]);

      }

    };

    fetchInventoryData();

  }, []);

  return (

    <Container sx={{ mt: 4 }}>

      <Typography variant="h4">
        Inventory
      </Typography>

      <InventorySummary
        products={products}
        purchases={purchases}
      />

      <Paper sx={{ p: 3, mt: 3 }}>
        <InventoryTable products={products} />
      </Paper>

      <InventoryMovement
        products={products}
        purchases={purchases}
        sales={sales}   // ✅ pass sales here
      />

    </Container>

  );

}