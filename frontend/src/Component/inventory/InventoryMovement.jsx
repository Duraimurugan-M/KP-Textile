import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TextField,
  Button,
} from "@mui/material";

export default function InventoryMovement({
  products = [],
  purchases = [],
  sales = [],
  search = "",
  setSearch,
  sort = "",
  setSort,
  fromDate = "",
  setFromDate,
  toDate = "",
  setToDate,
  page = 1,
  setPage,
  limit = 10,
}) {
  const productRows = products.map((product) => ({
    id: `product-${product._id || product.id}`,
    date: product.createdAt ? new Date(product.createdAt) : null,
    source: "Product",
    productName: product.name || "Unknown",
    supplierName: "-",
    price: Number(product.price || 0),
    qty: Number(product.stock || 0),
    status: "Snapshot",
    note: "Current stock snapshot",
  }));

  const purchaseRows = purchases.flatMap((purchase) =>
    (purchase.items || []).map((item, index) => ({
      id: `purchase-${purchase._id || purchase.id}-${index}`,
      date: purchase.createdAt ? new Date(purchase.createdAt) : null,
      source: "Purchase",
      productName:
        item?.product?.name || item.productName || "Unknown",
      supplierName:
        purchase?.supplier?.name || purchase.supplierName || "-",
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      status: "Stock In",
      note: "Stock added",
    }))
  );

  const saleRows = sales.flatMap((sale) =>
    (sale.items || []).map((item, index) => ({
      id: `sale-${sale._id || sale.id}-${index}`,
      date: sale.createdAt ? new Date(sale.createdAt) : null,
      source: "Sale",
      productName:
        item?.product?.name || item.productName || "Unknown",
      supplierName:
        sale?.customer?.name || "Walk-in",
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      status: "Stock Out",
      note: "Product sold",
    }))
  );

  let movements = [
    ...saleRows,
    ...purchaseRows,
    ...productRows,
  ];

  if (search.trim()) {
    const searchValue = search.toLowerCase();

    movements = movements.filter((row) => {
      const price = String(row.price || "");
      const qty = String(row.qty || "");

      return (
        (row.source || "").toLowerCase().includes(searchValue) ||
        (row.productName || "").toLowerCase().includes(searchValue) ||
        (row.supplierName || "").toLowerCase().includes(searchValue) ||
        (row.status || "").toLowerCase().includes(searchValue) ||
        (row.note || "").toLowerCase().includes(searchValue) ||
        price.includes(searchValue) ||
        qty.includes(searchValue)
      );
    });
  }

  if (fromDate) {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    movements = movements.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      rowDate.setHours(0, 0, 0, 0);
      return rowDate >= from;
    });
  }

  if (toDate) {
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    movements = movements.filter((row) => {
      if (!row.date) return false;
      return new Date(row.date) <= to;
    });
  }

  if (sort) {
    const isDesc = sort.startsWith("-");
    const key = isDesc ? sort.slice(1) : sort;

    movements.sort((a, b) => {
      let aValue;
      let bValue;

      if (key === "date") {
        aValue = a.date ? a.date.getTime() : 0;
        bValue = b.date ? b.date.getTime() : 0;
      } else if (key === "status") {
        const statusOrder = {
          Snapshot: 1,
          "Stock In": 2,
          "Stock Out": 3,
        };
        aValue = statusOrder[a.status] || 0;
        bValue = statusOrder[b.status] || 0;
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
  } else {
    movements.sort((a, b) => {
      const first = a.date ? a.date.getTime() : 0;
      const second = b.date ? b.date.getTime() : 0;
      return second - first;
    });
  }

  const total = movements.length;

  const paginatedMovements = movements.slice(
    (page - 1) * limit,
    (page - 1) * limit + limit
  );

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          Inventory Movement
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <TextField
            select
            size="small"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            SelectProps={{ native: true }}
          >
            <option value="">None</option>
            <option value="-date">Newest</option>
            <option value="date">Oldest</option>
            <option value="source">Source A-Z</option>
            <option value="-source">Source Z-A</option>
            <option value="productName">Product A-Z</option>
            <option value="-productName">Product Z-A</option>
            <option value="supplierName">Supplier / Customer A-Z</option>
            <option value="-supplierName">Supplier / Customer Z-A</option>
            <option value="price">Price Low-High</option>
            <option value="-price">Price High-Low</option>
            <option value="qty">Qty Low-High</option>
            <option value="-qty">Qty High-Low</option>
            <option value="status">Status A-Z</option>
            <option value="-status">Status Z-A</option>
          </TextField>

          <TextField
            size="small"
            type="date"
            label="From"
            value={fromDate}
            onChange={(e) => {
              setPage(1);
              setFromDate(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            type="date"
            label="To"
            value={toDate}
            onChange={(e) => {
              setPage(1);
              setToDate(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Supplier / Customer</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedMovements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No inventory movement found
                </TableCell>
              </TableRow>
            )}

            {paginatedMovements.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.date ? row.date.toLocaleString() : "-"}
                </TableCell>

                <TableCell>{row.source}</TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell>{row.supplierName}</TableCell>
                <TableCell>{`Rs ${row.price.toLocaleString()}`}</TableCell>
                <TableCell>{row.qty}</TableCell>

                <TableCell>
                  {row.status === "Stock In" && (
                    <Chip size="small" color="success" label="Stock In" />
                  )}

                  {row.status === "Stock Out" && (
                    <Chip size="small" color="error" label="Stock Out" />
                  )}

                  {row.status === "Snapshot" && (
                    <Chip size="small" color="default" label="Snapshot" />
                  )}
                </TableCell>

                <TableCell>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </Button>

        <Typography>Page {page}</Typography>

        <Button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Paper>
  );
}