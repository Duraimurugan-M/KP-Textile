import { useEffect, useState, useMemo } from "react";
import { Typography, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SalesForm from "../../Component/Sales/SalesForm";
import SalesList from "../../Component/Sales/SalesList";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export default function SalesModule() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [billMode, setBillMode] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchData = async () => {
    try {
      const p = await customFetch.get("products");
      const s = await customFetch.get("sales");
      const c = await customFetch.get("customers");

      setProducts(p.data.products || []);
      setSales(s.data.sales || []);
      setCustomers(c.data.customers || []);
    } catch {
      toast.error("Failed to load sales data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSale = async (data) => {
    try {
      await customFetch.post("sales", data);
      toast.success("Sale completed");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Sale failed");
    }
  };

  const handleOpenInvoice = (sale) => {
    navigate("/app/bill", { state: { sale } });
  };

  const processedSales = useMemo(() => {
    let data = [...sales];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      data = data.filter((sale) => {
        const customerName = sale.customer?.name?.toLowerCase() || "walk-in";

        const itemNames =
          sale.items?.map(
            (item) =>
              `${item.product?.name || ""} ${item.product?.productCode || ""}`.toLowerCase()
          ) || [];

        const gstText = sale.gstMode === "without" ? "bill" : "gst";

        return (
          customerName.includes(searchValue) ||
          itemNames.some((name) => name.includes(searchValue)) ||
          gstText.includes(searchValue)
        );
      });
    }

    if (sort) {
      const isDesc = sort.startsWith("-");
      const key = isDesc ? sort.slice(1) : sort;

      data.sort((a, b) => {
        let aValue;
        let bValue;

        if (key === "customer") {
          aValue = a.customer?.name || "Walk-in";
          bValue = b.customer?.name || "Walk-in";
        } else if (key === "qty") {
          aValue = a.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
          bValue = b.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
        } else if (key === "createdAt") {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return isDesc ? 1 : -1;
        if (aValue > bValue) return isDesc ? -1 : 1;
        return 0;
      });
    }

    return data;
  }, [sales, search, sort]);

  const total = processedSales.length;

  const paginatedSales = useMemo(() => {
    const start = (page - 1) * limit;
    return processedSales.slice(start, start + limit);
  }, [processedSales, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography variant="h4" mb={3}>
        Sales
      </Typography>

      <Stack spacing={3} sx={{ width: "100%" }}>
        <SalesForm
          products={products}
          customers={customers}
          onSale={handleSale}
          billMode={billMode}
        />

        <SalesList
          sales={paginatedSales}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total={total}
          billMode={billMode}
          setBillMode={setBillMode}
          onOpenInvoice={handleOpenInvoice}
        />
      </Stack>
    </Box>
  );
}
