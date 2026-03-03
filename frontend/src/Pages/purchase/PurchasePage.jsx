import { useState, useEffect } from "react";
import { Container, Typography, Paper } from "@mui/material";
import PurchaseList from "../../Component/purhcase/PurhcaseList";
import PurchaseForm from "../../Component/purhcase/purchaseForm";

export default function PurchasePage() {
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || [],
  );

  const [purchases, setPurchases] = useState(
    () => JSON.parse(localStorage.getItem("purchases")) || [],
  );

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // 🔥 MAIN HANDLER
const handlePurchase = (rows) => {
  const purchase = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),

    // ✅ FIX: correct fields
    supplierId: rows[0].supplierId,
    supplierName: rows[0].supplierName,

    items: rows.map((r) => ({
      productId: r.productId,
      qty: Number(r.qty),
      price: Number(r.price),
    })),
  };

  // 💾 Save purchase
  setPurchases((prev) => [purchase, ...prev]);

  // 📦 Update stock
  setProducts((prev) =>
    prev.map((p) => {
      const found = purchase.items.find((i) => i.productId === p.id);
      return found ? { ...p, stock: p.stock + found.qty } : p;
    })
  );
};

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Purchase Module</Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <PurchaseForm products={products} onPurchase={handlePurchase} />
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <PurchaseList purchases={purchases} products={products} />
      </Paper>
    </Container>
  );
}
