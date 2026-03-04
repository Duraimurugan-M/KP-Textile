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

export default function VendorList({
  vendors,
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  limit,
  total,
  onEdit,
  onDelete,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      {/* 🔥 SEARCH + SORT INSIDE CARD */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">
          Vendor List
        </Typography>

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
            onChange={(e) => setSort(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">None</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vendors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No vendors found
                </TableCell>
              </TableRow>
            )}

            {vendors.map((vendor, i) => (
              <TableRow key={vendor._id}>
                <TableCell>{(page - 1) * limit + i + 1}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.mobile}</TableCell>
                <TableCell>{vendor.email || "-"}</TableCell>
                <TableCell>{vendor.gst || "-"}</TableCell>
                <TableCell>{vendor.state || "-"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(vendor)}>
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

      {/* 🔥 PAGINATION RIGHT CORNER */}
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

        <Typography>
          Page {page}
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