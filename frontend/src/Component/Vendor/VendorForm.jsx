import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

export default function VendorForm({
  form,
  onChange,
  onSubmit,
  onCancel,   // ✅ added
  isEdit,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Vendor" : "Add Vendor"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="GST Number"
            name="gst"
            value={form.gst}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={form.state}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address"
            name="address"
            value={form.address}
            onChange={onChange}
          />
        </Grid>

        {/* ✅ BUTTON SECTION */}
        <Grid item xs={12} textAlign="right">
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={onSubmit}
            >
              {isEdit ? "Update Vendor" : "Add Vendor"}
            </Button>

            {isEdit && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}