import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const emptyRow = () => ({
  productId: "",
  qty: "",
  price: "",
  supplierId: "",
});

export default function PurchaseForm({
  products = [],
  vendors = [],
  onSubmit,
  editData,
}) {
  const [rows, setRows] = useState([emptyRow()]);

  useEffect(() => {
    if (editData) {
      setRows(
        editData.items.map((item) => ({
          productId: item.product?._id || item.productId,
          qty: item.qty,
          price: item.price,
          supplierId: editData.supplier?._id,
        }))
      );
    }
  }, [editData]);

  const change = (i, e) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [e.target.name]: e.target.value };
    setRows(updated);
  };

  const addRow = () => setRows([...rows, emptyRow()]);

  const removeRow = (i) => {
    const filtered = rows.filter((_, index) => index !== i);
    setRows(filtered.length ? filtered : [emptyRow()]);
  };

  const submit = (e) => {
    e.preventDefault();

    const valid = rows.filter(
      (r) => r.productId && r.qty && r.price && r.supplierId
    );

    if (!valid.length) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      supplier: valid[0].supplierId,
      items: valid.map((r) => ({
        product: r.productId,
        qty: Number(r.qty),
        price: Number(r.price),
      })),
    });

    setRows([emptyRow()]);
  };

  return (
    <>
      <Typography variant="h6" mb={2}>
        Add Multiple Purchases
      </Typography>

      <form onSubmit={submit}>
        {rows.map((r, i) => (
          <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) =>
                  `${option.name} (${option.productCode || ""})`
                }
                value={products.find((p) => p._id === r.productId) || null}
                onChange={(event, newValue) =>
                  change(i, {
                    target: {
                      name: "productId",
                      value: newValue?._id || "",
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Product" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Qty"
                name="qty"
                type="number"
                fullWidth
                value={r.qty}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={r.price}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={vendors}
                getOptionLabel={(option) =>
                  `${option.name} (${option.mobile || ""})`
                }
                value={vendors.find((v) => v._id === r.supplierId) || null}
                onChange={(event, newValue) =>
                  change(i, {
                    target: {
                      name: "supplierId",
                      value: newValue?._id || "",
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Supplier" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <IconButton color="error" onClick={() => removeRow(i)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<AddIcon />} onClick={addRow} sx={{ mr: 2 }}>
          Add Row
        </Button>

        <Button variant="contained" type="submit">
          {editData ? "Update" : "Save All"}
        </Button>
      </form>
    </>
  );
}
