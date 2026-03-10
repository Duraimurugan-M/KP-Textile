import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export default function InventoryTable({
  products = [],
  search = "",
  setSearch,
  sort = "",
  setSort,
  page = 1,
  setPage,
  limit = 10,
  total = 0,
}) {
  const stockStatus = (stock) => {
    const currentStock = Number(stock || 0);
    if (currentStock === 0) return <Chip label="Out" color="error" />;
    if (currentStock < 10) return <Chip label="Low" color="warning" />;
    return <Chip label="In Stock" color="success" />;
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Current Stock</Typography>

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
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="category">Category A-Z</option>
            <option value="-category">Category Z-A</option>
            <option value="price">Price Low-High</option>
            <option value="-price">Price High-Low</option>
            <option value="stock">Stock Low-High</option>
            <option value="-stock">Stock High-Low</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}

            {products.map((p) => (
              <TableRow key={p._id || p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.productCode || "-"}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{`Rs ${Number(p.price || 0).toLocaleString()}`}</TableCell>
                <TableCell>{Number(p.stock || 0)}</TableCell>
                <TableCell>{stockStatus(p.stock)}</TableCell>
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
    </>
  );
}
