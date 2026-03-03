import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// 🔥 Factory function (important)
const emptyRow = () => ({
  name: "",
  productCode: "",
  hsnCode: "",
  category: "",
  fabric: "",
  color: "",
  price: "",
  stock: "",
  description: "",
});


export default function ProductForm({ addProduct }) {
  const [rows, setRows] = useState([emptyRow()]);

  const handleChange = (index, e) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [e.target.name]: e.target.value,
    };
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, emptyRow()]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated.length ? updated : [emptyRow()]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

 const validRows = rows.filter(
  (row) => row.name && row.productCode && row.hsnCode
);

if (validRows.length === 0) return;

addProduct(validRows);


    setRows([emptyRow()]);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Products
      </Typography>

      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{
              mb: 2,
              borderBottom: "1px solid #eee",
              pb: 2,
            }}
          >
            <Grid item xs={12} md={2}>
              <TextField
                label="Name"
                name="name"
                sx={{ width: 200 }}
                value={row.name}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
  label="Category"
  name="category"
  sx={{ width: 200 }}
  value={row.category}
  onChange={(e) => handleChange(index, e)}
/>

            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Fabric"
                name="fabric"
                sx={{ width: 200 }}
                value={row.fabric}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Color"
                name="color"
                sx={{ width: 200 }}
                value={row.color}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <TextField
                label="Price"
                name="price"
                type="number"
                sx={{ width: 200 }}
                value={row.price}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                sx={{ width: 200 }}
                value={row.stock}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <TextField
                label="product Code"
                name="productCode"
                sx={{ width: 200 }}
                value={row.productCode}
                onChange={(e) => handleChange(index, e)}
              />
            </Grid>

            <Grid item xs={12} md={2}>
  <TextField
    label="HSN Code"
    name="hsnCode"
    sx={{ width: 200 }}
    value={row.hsnCode}
    onChange={(e) => handleChange(index, e)}
  />
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    label="Description"
    name="description"
    value={row.description}
    onChange={(e) => handleChange(index, e)}
  />
</Grid>


            <Grid item xs={12} md={0.5}>
              <IconButton color="error" onClick={() => removeRow(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addRow}
          sx={{ mr: 2, width: 200, height: 55 }}
        >
          Add Row
        </Button>

        <Button
          variant="contained"
          sx={{ width: 200, height: 55 }}
          type="submit"
        >
          Save All
        </Button>
      </form>
    </>
  );
}
