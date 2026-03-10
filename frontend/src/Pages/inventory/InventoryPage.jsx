import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Paper } from "@mui/material";
import InventorySummary from "../../Component/inventory/InventorySummary";
import InventoryTable from "../../Component/inventory/InvnentoryTable";
import InventoryMovement from "../../Component/inventory/InventoryMovement";
import customFetch from "../../utils/customFetch";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);

  const [stockSearch, setStockSearch] = useState("");
  const [stockSort, setStockSort] = useState("");
  const [stockPage, setStockPage] = useState(1);
  const [stockLimit, setStockLimit] = useState(10);

  const [movementSearch, setMovementSearch] = useState("");
  const [movementSort, setMovementSort] = useState("");
  const [movementFromDate, setMovementFromDate] = useState("");
  const [movementToDate, setMovementToDate] = useState("");
  const [movementPage, setMovementPage] = useState(1);
  const [movementLimit, setMovementLimit] = useState(10);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [productsRes, purchasesRes, salesRes] = await Promise.all([
          customFetch.get("products"),
          customFetch.get("purchases"),
          customFetch.get("sales"),
        ]);

        setProducts(productsRes.data?.products || []);
        setPurchases(purchasesRes.data?.purchases || []);
        setSales(salesRes.data?.sales || []);
      } catch (error) {
        console.error("Failed to load inventory data:", error);
        setProducts([]);
        setPurchases([]);
        setSales([]);
      }
    };

    fetchInventoryData();
  }, []);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (stockSearch.trim()) {
      const searchValue = stockSearch.toLowerCase();

      data = data.filter((p) => {
        const status =
          Number(p.stock || 0) === 0
            ? "out"
            : Number(p.stock || 0) < 10
            ? "low"
            : "in stock";

        return (
          (p.name || "").toLowerCase().includes(searchValue) ||
          (p.productCode || "").toLowerCase().includes(searchValue) ||
          (p.category || "").toLowerCase().includes(searchValue) ||
          String(p.price || "").includes(searchValue) ||
          String(p.stock || "").includes(searchValue) ||
          status.includes(searchValue)
        );
      });
    }

    if (stockSort) {
      const isDesc = stockSort.startsWith("-");
      const key = isDesc ? stockSort.slice(1) : stockSort;

      data.sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];

        if (key === "createdAt") {
          aValue = new Date(aValue || 0).getTime();
          bValue = new Date(bValue || 0).getTime();
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return isDesc ? 1 : -1;
        if (aValue > bValue) return isDesc ? -1 : 1;
        return 0;
      });
    }

    return data;
  }, [products, stockSearch, stockSort]);

  const paginatedProducts = useMemo(() => {
    const start = (stockPage - 1) * stockLimit;
    return filteredProducts.slice(start, start + stockLimit);
  }, [filteredProducts, stockPage, stockLimit]);

  useEffect(() => {
    setStockPage(1);
  }, [stockSearch, stockSort]);

  useEffect(() => {
    setMovementPage(1);
  }, [movementSearch, movementSort, movementFromDate, movementToDate]);

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
        <InventoryTable
          products={paginatedProducts}
          search={stockSearch}
          setSearch={setStockSearch}
          sort={stockSort}
          setSort={setStockSort}
          page={stockPage}
          setPage={setStockPage}
          limit={stockLimit}
          setLimit={setStockLimit}
          total={filteredProducts.length}
        />
      </Paper>

      <InventoryMovement
        products={products}
        purchases={purchases}
        sales={sales}
        search={movementSearch}
        setSearch={setMovementSearch}
        sort={movementSort}
        setSort={setMovementSort}
        fromDate={movementFromDate}
        setFromDate={setMovementFromDate}
        toDate={movementToDate}
        setToDate={setMovementToDate}
        page={movementPage}
        setPage={setMovementPage}
        limit={movementLimit}
        setLimit={setMovementLimit}
      />
    </Container>
  );
}
