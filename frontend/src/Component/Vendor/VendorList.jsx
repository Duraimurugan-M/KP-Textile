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

export default function VendorList({
  vendors,
  onEdit,
  onDelete,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Vendor List
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
            {vendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No vendors added
                </TableCell>
              </TableRow>
            )}

            {vendors.map((vendor, i) => (
              <TableRow key={vendor._id} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.mobile}</TableCell>
                <TableCell>{vendor.email || "-"}</TableCell>
                <TableCell>{vendor.gst || "-"}</TableCell>
                <TableCell>{vendor.state || "-"}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => onEdit(vendor)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(vendor._id)}
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