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
} from "@mui/material";
import Barcode from "react-barcode";

export default function ProductList({
  products = [],
  selected,
  toggleSelect,
  toggleSelectAll,
}) {
  const allSelected = products.length > 0 && selected.length === products.length;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Product List
      </Typography>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              {/* SELECT ALL CHECKBOX */}
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
              <TableCell>Barcode</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p, i) => (
              <TableRow key={p._id} hover>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(p._id)}
                    onChange={() => toggleSelect(p)}
                  />
                </TableCell>

                <TableCell>{i + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.fabric}</TableCell>
                <TableCell>{p.color}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.productCode}</TableCell>

                <TableCell>
                  <div id={`barcode-${p._id}`}>
                    <Barcode
                      value={p.productCode}
                      width={1}
                      height={40}
                      fontSize={12}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}