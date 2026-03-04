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
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from "@mui/material";
import { useState } from "react";

export default function PurchaseList({
  purchases = [],
  products = [],
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const getProductName = (item) => {
    if (item.product?.name) return item.product.name;

    const id = item.product || item.productId;
    return products.find((p) => (p._id || p.id) === id)?.name || "Unknown";
  };

  const view = (purchase) => {
    setSelected(purchase);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm("Delete this purchase?");
    if (!confirmed) return;

    await onDelete?.(id);

    if (selected?._id === id || selected?.id === id) {
      setOpen(false);
      setSelected(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Purchase History</Typography>
      </Stack>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total Items</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No purchases found
                </TableCell>
              </TableRow>
            )}

            {purchases.map((purchase, index) => {
              const id = purchase._id || purchase.id;

              return (
                <TableRow key={id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {purchase.createdAt
                      ? new Date(purchase.createdAt).toLocaleDateString()
                      : purchase.date}
                  </TableCell>
                  <TableCell>
                    {purchase.supplier?.name || purchase.supplierName || "Unknown"}
                  </TableCell>
                  <TableCell>{purchase.items?.length || 0}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Button size="small" onClick={() => view(purchase)}>
                        View
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(id)}
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

      {selected && (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Purchase Details</DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selected.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{getProductName(item)}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{`Rs ${Number(item.price || 0).toLocaleString()}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  );
}
