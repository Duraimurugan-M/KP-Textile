import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";

export default function CustomerForm({
  form,
  onChange,
  onSubmit,
  isEdit,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Customer" : "Add Customer"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Customer Name"
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

        <Grid item xs={12} textAlign="right">
          <Button variant="contained" onClick={onSubmit}>
            {isEdit ? "Update Customer" : "Add Customer"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
