import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

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

export default function ProductForm({
  editProduct,
  editId,
  setEditId,
  fetchProducts,
}) {

  const [rows, setRows] = useState([emptyRow()]);

  /* FILL FORM WHEN EDIT CLICK */

useEffect(() => {

  if (editProduct) {

    setRows([{
      name: editProduct.name || "",
      productCode: editProduct.productCode || "",
      hsnCode: editProduct.hsnCode || "",
      category: editProduct.category || "",
      fabric: editProduct.fabric || "",
      color: editProduct.color || "",
      price: editProduct.price || "",
      stock: editProduct.stock || "",
      description: editProduct.description || "",
    }]);

  }

  /* CLEAR FORM WHEN CANCEL EDIT */

  if (!editProduct) {

    setRows([emptyRow()]);

  }

}, [editProduct]);

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

  /* SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const validRows = rows.filter(
      (row) => row.name && row.productCode && row.hsnCode
    );

    if (validRows.length === 0) {

      toast.warning("Please fill required fields");

      return;

    }

    try {

      /* EDIT MODE */

      if (editId) {

        await customFetch.patch(
          `/products/${editId}`,
          validRows[0]
        );

        toast.success("Product updated");

        setEditId(null);

      }

      /* ADD MODE */

      else {

        await customFetch.post(
          "/products",
          { products: validRows }
        );

        toast.success("Products added");

      }

      setRows([emptyRow()]);

      fetchProducts();

    } catch {

      toast.error("Operation failed");

    }

  };

  return (

    <>

      <Typography variant="h6" sx={{ mb: 2 }}>

        {editId ? "Edit Product" : "Add Products"}

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
                fullWidth
                value={row.name}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={2}>

              <TextField
                label="Category"
                name="category"
                fullWidth
                value={row.category}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={2}>

              <TextField
                label="Fabric"
                name="fabric"
                fullWidth
                value={row.fabric}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={2}>

              <TextField
                label="Color"
                name="color"
                fullWidth
                value={row.color}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={1}>

              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={row.price}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={1}>

              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={row.stock}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={1.5}>

              <TextField
                label="Product Code"
                name="productCode"
                fullWidth
                value={row.productCode}
                onChange={(e) => handleChange(index, e)}
              />

            </Grid>

            <Grid item xs={12} md={1.5}>

              <TextField
                label="HSN Code"
                name="hsnCode"
                fullWidth
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

            {!editId && (

              <Grid item xs={12} md={0.5}>

                <IconButton
                  color="error"
                  onClick={() => removeRow(index)}
                >

                  <DeleteIcon />

                </IconButton>

              </Grid>

            )}

          </Grid>

        ))}

        {!editId && (

          <Button
            startIcon={<AddIcon />}
            onClick={addRow}
            sx={{ mr: 2, width: 200, height: 55 }}
          >
            Add Row
          </Button>

        )}

        <Button
          variant="contained"
          sx={{ width: 200, height: 55 }}
          type="submit"
        >

          {editId ? "Update Product" : "Save All"}

        </Button>

      </form>

    </>

  );

}