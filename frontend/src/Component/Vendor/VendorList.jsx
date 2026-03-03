import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  TableContainer,
} from "@mui/material";

export default function VendorList({ vendors, onEdit, onDelete }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Vendor List
      </Typography>

      {/* ✅ RESPONSIVE CONTAINER */}
      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 750, // 🔑 KEY FOR MOBILE RESPONSIVENESS
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>GST</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No vendors added
                </TableCell>
              </TableRow>
            )}

            {vendors.map((v, i) => (
              <TableRow key={i} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.mobile}</TableCell>
                <TableCell>{v.gst || "-"}</TableCell>
                <TableCell>{v.state || "-"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(i)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(i)}
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
