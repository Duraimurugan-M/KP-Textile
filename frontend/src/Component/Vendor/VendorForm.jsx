import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Autocomplete,
} from "@mui/material";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* width calculator */
const clampWidthCh = (len, min = 20, max = 44) =>
  `${Math.min(Math.max(len, min), max)}ch`;

/* find second longest state name */
const sortedLengths = indianStates
  .map((state) => state.length)
  .sort((a, b) => b - a);

const secondLargestLength = sortedLengths[1] || sortedLengths[0];

const stateFieldWidth = clampWidthCh(secondLargestLength + 4);

export default function VendorForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isEdit,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Vendor" : "Add Vendor"}
      </Typography>

      <Grid container spacing={2}>
        {/* Vendor Name */}
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

        {/* Mobile */}
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

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </Grid>

        {/* GST */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="GST Number"
            name="gst"
            value={form.gst}
            onChange={onChange}
          />
        </Grid>

        {/* State Dropdown */}
        <Grid item xs={12} md="auto">
          <Autocomplete
            options={indianStates}
            value={form.state || null}
            onChange={(event, newValue) => {
              onChange({
                target: {
                  name: "state",
                  value: newValue || "",
                },
              });
            }}
            sx={{
              width: { xs: "100%", md: stateFieldWidth },
              maxWidth: "100%",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="State"
                name="state"
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Address */}
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

        {/* Buttons */}
        <Grid item xs={12} textAlign="right">
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={onSubmit}>
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