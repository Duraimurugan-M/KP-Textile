import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
} from "@mui/material";

import ProductForm from "../../Component/product/ProductForm";
import ProductList from "../../Component/product/ProductList";

import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export default function ProductPage() {

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {

      const { data } = await customFetch.get("/products");

      setProducts(data.products);

    } catch (error) {

      toast.error("Failed to load products");

    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= SELECT PRODUCT ================= */

  const toggleSelect = (product) => {

    if (selectedProducts.some(p => p._id === product._id)) {

      setSelectedProducts(
        selectedProducts.filter(p => p._id !== product._id)
      );

    } else {

      setSelectedProducts([...selectedProducts, product]);

    }
  };

  /* ================= SELECT ALL ================= */

  const toggleSelectAll = (checked) => {

    if (checked) {

      setSelectedProducts(products);

    } else {

      setSelectedProducts([]);

    }

  };

  /* ================= PRINT BARCODES ================= */

  const printBarcodes = () => {

    if (!selectedProducts.length) {

      toast.warning("Select products first");
      return;

    }

    const printWindow = window.open("", "_blank");

    let html = "";

    selectedProducts.forEach((p) => {

      const barcodeElement = document.getElementById(`barcode-${p._id}`);

      const barcodeSVG = barcodeElement?.innerHTML || "";

      html += `
        <div class="label">

          <div class="shop">KP Textile</div>

          <div class="name">${p.name}</div>

          <div class="price">MRP ₹${p.price}</div>

          ${barcodeSVG}

          <div class="code">${p.productCode}</div>

        </div>
      `;
    });

    printWindow.document.write(`
      <html>

      <head>

      <title>Print Barcode</title>

      <style>

      body{
        display:flex;
        flex-wrap:wrap;
        gap:5mm;
        padding:5mm;
        font-family:Arial;
      }

      .label{
        width:50mm;
        height:25mm;
        border:1px solid black;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        text-align:center;
      }

      .shop{
        font-size:10px;
        font-weight:bold;
      }

      .name{
        font-size:9px;
      }

      .price{
        font-size:9px;
      }

      .code{
        font-size:8px;
      }

      svg{
        width:45mm;
        height:12mm;
      }

      </style>

      </head>

      <body>

      ${html}

      </body>

      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.print();

    }, 500);

  };

  /* ================= SEARCH FILTER ================= */

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (

    <Container sx={{ mt: 4 }}>

      <Typography variant="h4">
        Product Management
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <ProductForm addProduct={() => {}} />
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Search Product"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={printBarcodes}
          >
            Print Barcode
          </Button>
        </Grid>

      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>

        <ProductList
          products={filteredProducts}
          selected={selectedProducts.map(p => p._id)}
          toggleSelect={toggleSelect}
          toggleSelectAll={toggleSelectAll}
        />

      </Paper>

    </Container>
  );
}