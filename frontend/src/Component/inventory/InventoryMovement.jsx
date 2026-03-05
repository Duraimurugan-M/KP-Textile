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
} from "@mui/material";

export default function InventoryMovement({
  products = [],
  purchases = [],
  sales = [],
}) {

  /* =========================
     PRODUCT SNAPSHOT
  ========================= */

  const productRows = products.map((product) => ({
    id: `product-${product._id}`,
    date: product.createdAt ? new Date(product.createdAt) : null,
    source: "Product",
    productName: product.name || "Unknown",
    supplierName: "-",
    price: Number(product.price || 0),
    qty: Number(product.stock || 0),
    status: "Snapshot",
    note: "Current stock snapshot",
  }));


  /* =========================
     PURCHASE STOCK IN
  ========================= */

  const purchaseRows = purchases.flatMap((purchase) =>
    (purchase.items || []).map((item, index) => ({
      id: `purchase-${purchase._id}-${index}`,
      date: purchase.createdAt ? new Date(purchase.createdAt) : null,
      source: "Purchase",
      productName:
        typeof item.product === "object"
          ? item.product?.name
          : item.productName || "Unknown",
      supplierName:
        typeof purchase.supplier === "object"
          ? purchase.supplier?.name
          : purchase.supplierName || "-",
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      status: "Stock In",
      note: "Stock added",
    }))
  );


  /* =========================
     SALES STOCK OUT
  ========================= */

  const saleRows = sales.flatMap((sale) =>
    (sale.items || []).map((item, index) => ({
      id: `sale-${sale._id}-${index}`,
      date: sale.createdAt ? new Date(sale.createdAt) : null,
      source: "Sale",
      productName:
        typeof item.product === "object"
          ? item.product?.name
          : item.productName || "Unknown",
      supplierName:
        typeof sale.customer === "object"
          ? sale.customer?.name
          : "Walk-in",
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      status: "Stock Out",
      note: "Product sold",
    }))
  );


  /* =========================
     COMBINE ALL MOVEMENTS
  ========================= */

  const movements = [
    ...saleRows,
    ...purchaseRows,
    ...productRows,
  ].sort((a, b) => {

    const first = a.date ? a.date.getTime() : 0;
    const second = b.date ? b.date.getTime() : 0;

    return second - first;

  });


  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Inventory Movement
      </Typography>

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

            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No inventory movement found
                </TableCell>
              </TableRow>
            )}

            {movements.map((row) => (

              <TableRow key={row.id}>

                <TableCell>
                  {row.date ? row.date.toLocaleString() : "-"}
                </TableCell>

                <TableCell>{row.source}</TableCell>

                <TableCell>{row.productName}</TableCell>

                <TableCell>{row.supplierName}</TableCell>

                <TableCell>
                  {`Rs ${row.price.toLocaleString()}`}
                </TableCell>

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
    </Paper>
  );
}