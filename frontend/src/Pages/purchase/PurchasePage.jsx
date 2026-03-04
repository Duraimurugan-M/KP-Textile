import { useEffect, useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import PurchaseForm from "../../Component/purchase/PurchaseForm";
import PurchaseList from "../../Component/purchase/PurchaseList";
import customFetch from "../../utils/customFetch";

export default function PurchasePage() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchases, setPurchases] = useState([]);

const fetchData = async () => {
  try {
    const p = await customFetch.get("products");
    const v = await customFetch.get("vendors");
    const pur = await customFetch.get("purchases");

    // SAFE DATA EXTRACTION
    setProducts(p.data?.products || []);
    setVendors(v.data?.vendors || []);
    setPurchases(pur.data?.purchases || pur.data?.data || []);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    await customFetch.post("purchases", data);

    fetchData();
  };

  const handleDelete = async (id) => {
    await customFetch.delete(`purchases/${id}`);
    fetchData();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Purchase Module</Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <PurchaseForm
          products={products}
          vendors={vendors}
          onSubmit={handleSubmit}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <PurchaseList
          purchases={purchases}
          products={products}
          onDelete={handleDelete}
        />
      </Paper>
    </Container>
  );
}
