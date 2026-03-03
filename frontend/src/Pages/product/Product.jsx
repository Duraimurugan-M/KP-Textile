import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import ProductForm from "../../Component/product/ProductForm";
import ProductList from "../../Component/product/ProductList";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export default function ProductPage() {
const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  
  const [excelFile, setExcelFile] = useState(null);


  const uploadExcel = async () => {
  if (!excelFile) return toast.error("Select file first");

  const formData = new FormData();
  formData.append("file", excelFile);

  try {
    await customFetch.post("/products/upload-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Excel uploaded successfully");
    fetchProducts();

  } catch (error) {
    toast.error("Excel upload failed");
  }
};

const fetchProducts= async ()=>{
  try {
    const {data}= await customFetch.get("/products");
    setProducts(data.products);
  } catch (error) {
    console.log(error)
  }
};

useEffect(()=>{
  fetchProducts();
},[]);

  // ✅ CLONE OBJECT + UNIQUE ID
// const addProduct = async (p) => {
//   try {
//     await customFetch.post("/products", p);
//     toast.success("Product added successfully");
//     fetchProducts();
//   } catch (error) {
//     toast.error(error.response?.data?.msg || "Error adding product");
//   }
// };

const addProduct = async (products) => {
  try {
    await customFetch.post("/products/bulk", {
      products,
    });

    toast.success("Products added successfully");
    fetchProducts();

  } catch (error) {
    toast.error("Bulk insert failed");
  }
};


 const updateProduct = async (updated) => {
  try {
    await customFetch.patch(`/products/${updated._id}`, updated);
    toast.success("Product updated");
    fetchProducts();
  } catch (error) {
    toast.error("Update failed");
  }
};


 const deleteProduct = async (id) => {
  try {
    await customFetch.delete(`/products/${id}`);
    toast.success("Product deleted");
    fetchProducts();
  } catch (error) {
    toast.error("Delete failed");
  }
};


const filteredProducts = products.filter((p) =>
  p.name?.toLowerCase().includes(search.toLowerCase()) ||
  p.category?.toLowerCase().includes(search.toLowerCase())
);


  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Product Management</Typography>

<Paper sx={{ p: 3, mt: 3 }}>
  <Typography variant="h6">Bulk Upload (Excel)</Typography>

  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) => setExcelFile(e.target.files[0])}
  />

  <Button
    variant="contained"
    sx={{ ml: 2 }}
    onClick={uploadExcel}
  >
    Upload
  </Button>
</Paper>


      <Paper sx={{ p: 3, mt: 3 }}>
        <ProductForm addProduct={addProduct} />
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

       
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <ProductList
          products={filteredProducts}
          deleteProduct={deleteProduct}
          updateProduct={updateProduct}
        />
      </Paper>
    </Container>
  );
}
