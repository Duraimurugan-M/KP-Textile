import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  TableContainer,
} from "@mui/material";

export default function VendorList({
  vendors,
  onEdit,
  onDelete,
}) {
  return (
    <Paper>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.mobile}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.gst}</TableCell>
                <TableCell>{vendor.state}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => onEdit(vendor)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="contained"
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