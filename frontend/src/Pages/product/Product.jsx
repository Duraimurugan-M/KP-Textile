import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box
} from "@mui/material";

import ProductForm from "../../Component/product/ProductForm";
import ProductList from "../../Component/product/ProductList";

import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export default function ProductPage() {

  const [products,setProducts] = useState([]);
  const [selectedProducts,setSelectedProducts] = useState([]);
  const [search,setSearch] = useState("");
  const [excelFile,setExcelFile] = useState(null);

  const [editProduct,setEditProduct] = useState(null);
  const [editId,setEditId] = useState(null);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  /* FETCH PRODUCTS */

  const fetchProducts = async () => {

    try{
      const {data} = await customFetch.get("/products");
      setProducts(data.products);
    }catch{
      toast.error("Failed to load products");
    }

  };

  useEffect(()=>{ fetchProducts(); },[]);

  /* SELECT PRODUCT */

  const toggleSelect = (product)=>{

    if(selectedProducts.some(p=>p._id===product._id)){

      setSelectedProducts(
        selectedProducts.filter(p=>p._id!==product._id)
      );

    }else{

      setSelectedProducts([
        ...selectedProducts,
        {...product,copies:1}
      ]);

    }

  };

  /* SELECT ALL */

  const toggleSelectAll = (checked)=>{

    if(checked){

      const withCopies = products.map(p=>({...p,copies:1}));

      setSelectedProducts(withCopies);

    }else{

      setSelectedProducts([]);

    }

  };

  /* CLEAR SELECTION */

  const clearSelection = ()=>{

    setSelectedProducts([]);

  };

  /* UPDATE COPIES */

  const updateCopies = (id,value)=>{

    setSelectedProducts(prev =>
      prev.map(p =>
        p._id===id
          ? {...p,copies:Number(value)}
          : p
      )
    );

  };

  /* DELETE PRODUCT */

  const deleteProduct = async(id)=>{

    if(!window.confirm("Delete this product?")) return;

    try{

      await customFetch.delete(`/products/${id}`);

      toast.success("Product deleted");

      fetchProducts();

    }catch{

      toast.error("Delete failed");

    }

  };

  /* EDIT PRODUCT */

  const updateProduct = (product)=>{

    setEditProduct(product);
    setEditId(product._id);

    setTimeout(()=>{
      formRef.current?.scrollIntoView({behavior:"smooth"});
    },100);

  };

  /* CANCEL EDIT */

  const cancelEdit = ()=>{

    setEditProduct(null);
    setEditId(null);

  };

  /* BULK EXCEL UPLOAD */

  const uploadExcel = async()=>{

    if(!excelFile){

      toast.warning("Choose Excel file first");

      return;

    }

    const formData = new FormData();
    formData.append("file",excelFile);

    try{

      const res = await customFetch.post(
        "/products/upload-excel",
        formData,
        {headers:{ "Content-Type":"multipart/form-data" }}
      );

      toast.success(res.data?.message || "Excel uploaded successfully");

      setExcelFile(null);

      if(fileInputRef.current){
        fileInputRef.current.value="";
      }

      fetchProducts();

    }catch(error){

      const message =
        error.response?.data?.message ||
        "Upload failed";

      toast.error(message);

    }

  };

  const clearFile = ()=>{

    setExcelFile(null);

    if(fileInputRef.current){
      fileInputRef.current.value="";
    }

  };

  /* PRINT BARCODES */

const printBarcodes = () => {

  if (!selectedProducts.length) {
    toast.warning("Select products first");
    return;
  }

  const printWindow = window.open("", "_blank");

  let html = "";

  selectedProducts.forEach((p) => {

    const barcodeElement =
      document.getElementById(`barcode-${p._id}`);

    const barcodeSVG = barcodeElement?.innerHTML || "";

    const copies = Number(p.copies || 1);

    for (let i = 0; i < copies; i++) {

      html += `
      <div class="label">

        <div class="shop">KP Textile</div>

        <div class="barcode">
          ${barcodeSVG}
        </div>

        <div class="code">${p.productCode}</div>

        <div class="bottom">
          <span class="name">${p.name}</span>
          <span class="price">₹${p.price}</span>
        </div>

      </div>`;
    }

  });

  printWindow.document.write(`
  <html>
  <head>

  <style>

  @page{
    margin:0;
  }

  body{
    width:100mm;
    margin:0;
    display:grid;
    grid-template-columns:50mm 50mm;
    grid-auto-rows:25mm;
    font-family:Arial, Helvetica, sans-serif;
  }

  .label{
    width:50mm;
    height:25mm;
    border:1px solid black;
    box-sizing:border-box;
    padding:1.5mm;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
  }

  .shop{
    width:100%;
    text-align:center;
    font-weight:bold;
    font-size:11px;
  }

  .barcode{
    display:flex;
    justify-content:center;
  }

  .barcode svg{
    width:46mm;
    height:12mm;
  }

  .code{
    text-align:center;
    font-size:8px;
    font-weight:bold;
  }

  .bottom{
    display:flex;
    justify-content:space-between;
    font-size:9px;
  }

  .name{
    max-width:33mm;
    overflow:hidden;
    white-space:nowrap;
  }

  .price{
    font-weight:bold;
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

  /* SEARCH */

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Typography variant="h4">Product Management</Typography>

      {/* BULK UPLOAD */}

      <Paper
        sx={{ p: 3, mt: 3, border: "2px solid #999", background: "#fafafa" }}
      >
        <Typography variant="h6">Bulk Upload Products</Typography>

        <Box sx={{ mt: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setExcelFile(e.target.files[0])}
            style={{
              padding: "10px",
              border: "2px dashed #999",
              borderRadius: "6px",
            }}
          />

          <Button variant="contained" sx={{ ml: 2 }} onClick={uploadExcel}>
            Upload
          </Button>

          <Button variant="outlined" sx={{ ml: 1 }} onClick={clearFile}>
            Clear
          </Button>
        </Box>
      </Paper>

      {/* PRODUCT FORM */}

      <Paper sx={{ p: 3, mt: 3 }} ref={formRef}>
        <ProductForm
          editProduct={editProduct}
          editId={editId}
          setEditId={setEditId}
          fetchProducts={fetchProducts}
        />

        {editId && (
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="error" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          </Box>
        )}
      </Paper>

      {/* SEARCH */}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Search Product"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} textAlign="right">
          <Button variant="outlined" sx={{ mr: 1 }} onClick={clearSelection}>
            Clear Selected
          </Button>

          <Button variant="contained" onClick={printBarcodes}>
            Print Barcode
          </Button>
        </Grid>
      </Grid>

      {/* BARCODE COPIES */}

      {selectedProducts.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mt: 2,
            border: "2px solid #999",
            background: "#fafafa",
          }}
        >
          <Typography variant="subtitle1" mb={1}>
            Barcode Copies
          </Typography>

          {selectedProducts.map((p, index) => (
            <Box
              key={p._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
                border: "1px solid #ccc",
                p: 1,
                borderRadius: 1,
              }}
            >
              <strong>{index + 1}.</strong>

              {p.productCode}

              <input
                type="text"
                value={p.copies}
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === "" || /^[0-9]+$/.test(val)) {
                    updateCopies(p._id, val);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    updateCopies(p._id, 1);
                  }
                }}
                style={{
                  width: "60px",
                  padding: "4px",
                  border: "1px solid #aaa",
                }}
              />
            </Box>
          ))}
        </Paper>
      )}

      {/* PRODUCT LIST */}

      <Paper sx={{ p: 3, mt: 3 }}>
        <ProductList
          products={filteredProducts}
          selected={selectedProducts.map((p) => p._id)}
          toggleSelect={toggleSelect}
          toggleSelectAll={toggleSelectAll}
          deleteProduct={deleteProduct}
          updateProduct={updateProduct}
        />
      </Paper>
    </Container>
  );

}