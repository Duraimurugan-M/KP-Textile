import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";

export default function InventoryTable({ products = [] }) {
  const stockStatus = (stock) => {
    const currentStock = Number(stock || 0);
    if (currentStock === 0) return <Chip label="Out" color="error" />;
    if (currentStock < 10) return <Chip label="Low" color="warning" />;
    return <Chip label="In Stock" color="success" />;
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id || p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{`Rs ${Number(p.price || 0).toLocaleString()}`}</TableCell>
              <TableCell>{Number(p.stock || 0)}</TableCell>
              <TableCell>{stockStatus(p.stock)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
