import { useEffect, useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import SalesForm from "../../Component/Sales/SalesForm";
import SalesList from "../../Component/Sales/SalesList";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export default function SalesModule() {

  const [products,setProducts] = useState([]);
  const [sales,setSales] = useState([]);
  const [customers,setCustomers] = useState([]);

  const fetchData = async ()=>{

    try{

      const p = await customFetch.get("products");
      const s = await customFetch.get("sales");
      const c = await customFetch.get("customers");

      setProducts(p.data.products || []);
      setSales(s.data.sales || []);
      setCustomers(c.data.customers || []);

    }catch{

      toast.error("Failed to load sales data");

    }

  };

  useEffect(()=>{
    fetchData();
  },[]);

  const handleSale = async(data)=>{

    try{

      await customFetch.post("sales",data);

      toast.success("Sale completed");

      fetchData();

    }catch(error){

      toast.error(error.response?.data?.msg || "Sale failed");

    }

  };

  return(

    <Box sx={{ width:"100%", mt:2 }}>

      <Typography variant="h4" mb={3}>
        Sales
      </Typography>

      <Stack spacing={3} sx={{ width:"100%" }}>

        <SalesForm
          products={products}
          customers={customers}
          onSale={handleSale}
        />

        <SalesList sales={sales}/>

      </Stack>

    </Box>

  );

}