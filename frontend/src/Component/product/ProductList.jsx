import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Checkbox,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import Barcode from "react-barcode";

export default function ProductList({
  products = [],
  selected = [],
  toggleSelect,
  toggleSelectAll,
  deleteProduct,
  updateProduct,
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  limit,
  setLimit,
  total,
}) {
  const allSelected =
    products.length > 0 && products.every((p) => selected.includes(p._id));
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">
          Product List
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price Low-High</option>
            <option value="-price">Price High-Low</option>
            <option value="stock">Stock Low-High</option>
            <option value="-stock">Stock High-Low</option>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table
          size="small"
          sx={{
            width: "100%",
            "& th,& td": {
              padding: "6px 8px",
              fontSize: "13px"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </TableCell>

              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Fabric</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>HSN</TableCell>

              <TableCell
                sx={{
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                Description
              </TableCell>

              <TableCell>Barcode</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}

            {products.map((p, i) => {
              const isSelected = selected.includes(p._id);

              return (
                <TableRow key={p._id} hover>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelect(p)}
                    />
                  </TableCell>

                  <TableCell>{(page - 1) * limit + i + 1}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.fabric}</TableCell>
                  <TableCell>{p.color}</TableCell>
                  <TableCell>Rs {p.price}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.productCode}</TableCell>
                  <TableCell>{p.hsnCode}</TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {p.description}
                  </TableCell>

                  <TableCell>
                    <div id={`barcode-${p._id}`}>
                      <Barcode
                        value={p.productCode}
                        width={1}
                        height={35}
                        displayValue={false}
                        margin={0}
                      />
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    <Stack spacing={0.5}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => updateProduct(p)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
        mt={2}
      >
        <TextField
          select
          size="small"
          label="Rows"
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit?.(Number(e.target.value));
          }}
          SelectProps={{ native: true }}
          sx={{ width: 100 }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </TextField>

        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <Typography>
          Page {page} of {totalPages}
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
