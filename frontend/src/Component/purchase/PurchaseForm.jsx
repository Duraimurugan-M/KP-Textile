import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  Autocomplete
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const emptyRow = () => ({
  productId: "",
  qty: "",
  price: "",
  supplierId: ""
});

const ADD_SUPPLIER_OPTION = {
  _id: "__add_supplier__",
  name: "Add Supplier",
  mobile: "",
  isAddSupplier: true,
};

export default function PurchaseForm({
  products = [],
  vendors = [],
  onSubmit,
  editData,
  onOpenAddSupplier,
}) {
  const [rows, setRows] = useState([emptyRow()]);

  const clampWidthCh = (len, min = 24, max = 46) =>
    `${Math.min(Math.max(len, min), max)}ch`;

  const productFieldWidth = useMemo(() => {
    const maxLen = products.reduce((m, p) => {
      const label = `${p.name} (${p.productCode || ""})`;
      return Math.max(m, label.length);
    }, "Product".length);
    return clampWidthCh(maxLen + 4);
  }, [products]);

  const supplierFieldWidth = useMemo(() => {
    const maxLen = vendors.reduce((m, v) => {
      const label = `${v.name} (${v.mobile})`;
      return Math.max(m, label.length);
    }, "Supplier".length);
    return clampWidthCh(maxLen + 4);
  }, [vendors]);

  const supplierOptions = useMemo(() => {
    return [...vendors, ADD_SUPPLIER_OPTION];
  }, [vendors]);

  useEffect(() => {
    if (editData) {
      setRows(
        editData.items.map((item) => ({
          productId: item.product?._id,
          qty: item.qty,
          price: item.price,
          supplierId: editData.supplier?._id
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
      alert("Fill all fields");
      return;
    }

    onSubmit({
      supplier: valid[0].supplierId,
      items: valid.map((r) => ({
        product: r.productId,
        qty: Number(r.qty),
        price: Number(r.price)
      }))
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
            <Grid size={{ xs: 12, md: "auto" }}>
              <Autocomplete
                sx={{ width: { xs: "100%", md: productFieldWidth }, maxWidth: "100%" }}
                options={products}
                getOptionLabel={(p) => `${p.name} (${p.productCode || ""})`}
                value={products.find((p) => p._id === r.productId) || null}
                onChange={(e, v) =>
                  change(i, {
                    target: {
                      name: "productId",
                      value: v?._id || ""
                    }
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Product" fullWidth />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                label="Qty"
                name="qty"
                type="number"
                fullWidth
                value={r.qty}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={r.price}
                onChange={(e) => change(i, e)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: "auto" }}>
              <Autocomplete
                sx={{ width: { xs: "100%", md: supplierFieldWidth }, maxWidth: "100%" }}
                options={supplierOptions}
                getOptionLabel={(v) =>
                  v?.isAddSupplier ? "Add Supplier" : `${v.name} (${v.mobile})`
                }
                value={vendors.find((v) => v._id === r.supplierId) || null}
                onChange={(e, v) => {
                  if (v?.isAddSupplier) {
                    onOpenAddSupplier?.();
                    return;
                  }

                  change(i, {
                    target: {
                      name: "supplierId",
                      value: v?._id || ""
                    }
                  });
                }}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField {...params} label="Supplier" fullWidth />
                )}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={
                      option?.isAddSupplier
                        ? {
                            fontWeight: 600,
                            borderTop: "1px solid #e0e0e0",
                            color: "#1976d2",
                          }
                        : {}
                    }
                  >
                    {option?.isAddSupplier
                      ? "+ Add Supplier"
                      : `${option.name} (${option.mobile})`}
                  </li>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: "auto" }}>
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
          Save All
        </Button>
      </form>
    </>
  );
}
