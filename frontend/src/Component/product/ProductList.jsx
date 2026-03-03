import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TableContainer,
  Paper,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState } from "react";

export default function ProductList({
  products,
  deleteProduct,
  updateProduct,
}) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  // 🔥 Open edit dialog
  const handleEdit = (product) => {
    setEdit({ ...product }); // clone object
    setOpen(true);
  };

  // 🔥 Save edit
  const save = () => {
    updateProduct({ ...edit });
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
  <TableRow>
    <TableCell>Name</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Fabric</TableCell>
    <TableCell>Color</TableCell>
    <TableCell>HSN</TableCell>
    <TableCell>Price</TableCell>
    <TableCell>Stock</TableCell>
    <TableCell>Status</TableCell>
    <TableCell>Product Code</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>


          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
  <TableCell>{p.name}</TableCell>
  <TableCell>{p.category}</TableCell>
  <TableCell>{p.fabric}</TableCell>
  <TableCell>{p.color}</TableCell>
  <TableCell>{p.hsnCode}</TableCell>
  <TableCell>₹{p.price}</TableCell>
  <TableCell>{p.stock}</TableCell>

  <TableCell>
    <Chip
      label={
        p.stock === 0 ? "Out" : p.stock < 5 ? "Low" : "In Stock"
      }
      color={
        p.stock === 0
          ? "error"
          : p.stock < 5
          ? "warning"
          : "success"
      }
    />
  </TableCell>

  <TableCell>{p.productCode}</TableCell>

  <TableCell>
    <Button onClick={() => handleEdit(p)}>Edit</Button>
    <Button color="error" onClick={() => deleteProduct(p._id)}>
      Delete
    </Button>
  </TableCell>
</TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔥 FULL EDIT DIALOG */}
      {edit && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
          <DialogTitle>Edit Product</DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 200 }}
                  label="Name"
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
  sx={{ width: 200 }}
  label="Category"
  value={edit.category}
  onChange={(e) =>
    setEdit({ ...edit, category: e.target.value })
  }
/>

              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 200 }}
                  label="Fabric"
                  value={edit.fabric}
                  onChange={(e) => setEdit({ ...edit, fabric: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 200 }}
                  label="Color"
                  value={edit.color}
                  onChange={(e) => setEdit({ ...edit, color: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 200 }}
                  type="number"
                  label="Price"
                  value={edit.price}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      price: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 200 }}
                  type="number"
                  label="Stock"
                  value={edit.stock}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </Grid>

             <Grid item xs={12} md={6}>
  <TextField
    sx={{ width: 200 }}
    label="Product Code"
    value={edit.productCode}
    onChange={(e) =>
      setEdit({ ...edit, productCode: e.target.value })
    }
  />
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    sx={{ width: 200 }}
    label="HSN Code"
    value={edit.hsnCode}
    onChange={(e) =>
      setEdit({ ...edit, hsnCode: e.target.value })
    }
  />
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    label="Description"
    value={edit.description}
    onChange={(e) =>
      setEdit({ ...edit, description: e.target.value })
    }
  />
</Grid>

            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={save}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
