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
} from "@mui/material";

export default function CustomerList({
  customers,
  onEdit,
  onDelete,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Customer List
      </Typography>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>GST</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No customers added
                </TableCell>
              </TableRow>
            )}

            {customers.map((c, i) => (
              <TableRow key={c._id} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.mobile}</TableCell>
                <TableCell>{c.email || "-"}</TableCell>
                <TableCell>{c.gst || "-"}</TableCell>
                <TableCell>{c.state || "-"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(c)}>
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(c)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
