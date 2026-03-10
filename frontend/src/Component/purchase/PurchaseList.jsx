import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Stack,
  TextField,
} from "@mui/material";

export default function PurchaseList({
  purchases = [],
  products = [],
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  limit,
  total,
}) {
  const getSupplierName = (purchase) => {
    if (purchase?.supplier && typeof purchase.supplier === "object") {
      return purchase.supplier.name || "Unknown";
    }

    if (purchase?.supplierName) {
      return purchase.supplierName;
    }

    return "Unknown";
  };

  const getProductName = (item) => {
    if (item?.product && typeof item.product === "object") {
      return item.product.name || "Unknown";
    }

    const id = item.product || item.productId;
    return products.find((p) => (p._id || p.id) === id)?.name || "Unknown";
  };

  const getProductCode = (item) => {
    if (item?.product && typeof item.product === "object") {
      return item.product.productCode || "-";
    }

    const id = item.product || item.productId;
    return (
      products.find((p) => (p._id || p.id) === id)?.productCode || "-"
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">Purchase History</Typography>

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
            <option value="supplier">Supplier A-Z</option>
            <option value="-supplier">Supplier Z-A</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="totalItems">Items Low-High</option>
            <option value="-totalItems">Items High-Low</option>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Total Items</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No purchases found
                </TableCell>
              </TableRow>
            )}

            {purchases.map((purchase, index) => {
              const id = purchase._id || purchase.id;

              return (
                <TableRow key={id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>

                  <TableCell>
                    {purchase.createdAt
                      ? new Date(purchase.createdAt).toLocaleString()
                      : purchase.date || "-"}
                  </TableCell>

                  <TableCell>{getSupplierName(purchase)}</TableCell>

                  <TableCell>
                    {purchase.items?.length ? (
                      purchase.items.map((item, idx) => (
                        <div key={idx}>{getProductName(item)}</div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {purchase.items?.length ? (
                      purchase.items.map((item, idx) => (
                        <div key={idx}>{getProductCode(item)}</div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {purchase.items?.length ? (
                      purchase.items.map((item, idx) => (
                        <div key={idx}>{item.qty}</div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {purchase.items?.length ? (
                      purchase.items.map((item, idx) => (
                        <div key={idx}>
                          Rs {Number(item.price || 0).toLocaleString()}
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {purchase.items?.length ? (
                      purchase.items.map((item, idx) => (
                        <div key={idx}>
                          Rs{" "}
                          {Number((item.qty || 0) * (item.price || 0)).toLocaleString()}
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{purchase.items?.length || 0}</TableCell>
                </TableRow>
              );
            })}
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
