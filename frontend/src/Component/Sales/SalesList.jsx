import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  TextField,
  Button,
  TableContainer,
} from "@mui/material";

export default function SalesList({
  sales = [],
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  limit,
  total,
}) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const getItemNames = (items) => {
    return items
      .map((i) => {
        const name = i.product?.name || "Product";
        const code = i.product?.productCode || "";
        return `${name} (${code})`;
      })
      .join(", ");
  };

  const getTotalQty = (items) => {
    return items.reduce((sum, i) => sum + i.qty, 0);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">
          Sales History
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
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="customer">Customer A-Z</option>
            <option value="-customer">Customer Z-A</option>
            <option value="grossTotal">Gross Total Low-High</option>
            <option value="-grossTotal">Gross Total High-Low</option>
            <option value="grandTotal">Grand Total Low-High</option>
            <option value="-grandTotal">Grand Total High-Low</option>
            <option value="qty">Qty Low-High</option>
            <option value="-qty">Qty High-Low</option>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table
          size="small"
          sx={{
            minWidth: 900,
            "& th,& td": {
              padding: "6px 8px",
              fontSize: "13px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Bill</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Gross Total</TableCell>
              <TableCell>Grand Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No sales found
                </TableCell>
              </TableRow>
            )}

            {sales.map((sale, index) => (
              <TableRow key={sale._id}>
                <TableCell>
                  #{(page - 1) * limit + index + 1}
                </TableCell>

                <TableCell>
                  {formatDate(sale.createdAt)}
                </TableCell>

                <TableCell>
                  {sale.customer?.name || "Walk-in"}
                </TableCell>

                <TableCell sx={{ maxWidth: 300 }}>
                  {getItemNames(sale.items)}
                </TableCell>

                <TableCell>
                  {getTotalQty(sale.items)}
                </TableCell>

                <TableCell>
                  {sale.gstMode === "without" ? "Bill" : "GST"}
                </TableCell>

                <TableCell>
                  ₹{sale.grossTotal}
                </TableCell>

                <TableCell>
                  <b>₹{sale.grandTotal}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        mt={2}
      >
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <Typography>
          Page {page}
        </Typography>

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