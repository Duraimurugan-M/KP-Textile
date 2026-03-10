import { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Autocomplete,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const emptyRow = () => ({
  product: null,
  qty: 1,
  price: 0,
  stock: 0,
  discount: 0,
  cgst: 0,
  sgst: 0,
  igst: 0,
  total: 0,
});

export default function SalesForm({ products, customers, onSale, billMode }) {

  const [rows,setRows] = useState([]);
  const [customer,setCustomer] = useState(null);

  const barcodeRef = useRef(null);

  const scanBuffer = useRef("");
  const lastKeyTime = useRef(Date.now());
  const scanTimeout = useRef(null);

  /* =========================
     CALCULATE TOTAL
  ========================= */

  const calculateRow = (row)=>{

    const qty = Number(row.qty || 0);
    const price = Number(row.price || 0);

    const base = qty * price;

    const discountAmount =
      (base * Number(row.discount || 0)) / 100;

    const cgstAmount =
      billMode ? 0 : (base * Number(row.cgst || 0)) / 100;

    const sgstAmount =
      billMode ? 0 : (base * Number(row.sgst || 0)) / 100;

    const igstAmount =
      billMode ? 0 : (base * Number(row.igst || 0)) / 100;

    return {
      ...row,
      total:
        base -
        discountAmount +
        cgstAmount +
        sgstAmount +
        igstAmount
    };

  };

  /* =========================
     ADD PRODUCT
  ========================= */

  const addProductToBill = (product)=>{

    setRows(prev=>{

      const index = prev.findIndex(
        r => r.product?._id === product._id
      );

      if(index !== -1){

        const updated=[...prev];
        const currentQty = Number(updated[index].qty || 0);

        if(currentQty >= product.stock){

          toast.error(`Stock limit reached for ${product.name}`);
          return updated;

        }

        updated[index].qty = currentQty + 1;
        updated[index] = calculateRow(updated[index]);

        return updated;

      }

      const newRow={
        ...emptyRow(),
        product,
        price:product.price,
        stock:product.stock
      };

      return [...prev,calculateRow(newRow)];

    });

  };

  /* =========================
     PROCESS BARCODE
  ========================= */

  const processBarcode = (code)=>{

    const product = products.find(
      p => p.productCode?.toLowerCase() === code.toLowerCase()
    );

    if(!product){

      toast.error("Product not found");
      return;

    }

    addProductToBill(product);

  };

  /* =========================
     GLOBAL SCANNER LISTENER
  ========================= */

useEffect(()=>{

  const handleKeyDown = (e)=>{

    const active = document.activeElement;

    // If user typing inside input fields → ignore scanner logic
    if(
      active &&
      (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA"
      ) &&
      active !== barcodeRef.current
    ){
      return;
    }

    const now = Date.now();
    const diff = now - lastKeyTime.current;
    lastKeyTime.current = now;

    if(diff > 100){
      scanBuffer.current = "";
    }

    if(e.key.length === 1){

      scanBuffer.current += e.key;

      if(barcodeRef.current){
        barcodeRef.current.focus();
        barcodeRef.current.value = scanBuffer.current;
      }

    }

    clearTimeout(scanTimeout.current);

    scanTimeout.current = setTimeout(()=>{

      if(scanBuffer.current.length > 3){
        processBarcode(scanBuffer.current);
      }

      if(barcodeRef.current){
        barcodeRef.current.value = "";
      }

      scanBuffer.current="";

    },50);

  };

  window.addEventListener("keydown",handleKeyDown);

  return ()=>{
    window.removeEventListener("keydown",handleKeyDown);
  };

},[products]);

  /* =========================
     PRODUCT SELECT
  ========================= */

  const handleProductSelect = (product)=>{
    if(!product) return;
    addProductToBill(product);
  };

  /* =========================
     FIELD CHANGE
  ========================= */

  const change=(i,field,value)=>{

    const updated=[...rows];

    if(field==="qty"){
      const stock = Number(updated[i].stock || 0);
      let qtyValue = Number(value || 0);

      if(qtyValue > stock){

        toast.error("Cannot exceed available stock");
        qtyValue = stock;

      }
      value = qtyValue;

    }

    updated[i] = {
      ...updated[i],
      [field]: value
    };

    updated[i] = calculateRow(updated[i]);

    setRows(updated);

  };

  const removeRow=(i)=>{
    setRows(rows.filter((_,x)=>x!==i));
  };

  /* =========================
     TOTALS
  ========================= */

  const grossTotal =
    rows.reduce((s,r)=>s+r.price*r.qty,0);

  const discountTotal =
    rows.reduce((s,r)=>s+((Number(r.price || 0) * Number(r.qty || 0) * Number(r.discount || 0)) / 100),0);

  const grandTotal =
    rows.reduce((s,r)=>s+r.total,0);

  /* =========================
     SUBMIT
  ========================= */

  const submit=()=>{

    if(!customer){

      toast.error("Select customer");
      return;

    }

    const items = rows.map(r=>({

      product:r.product._id,
      qty:r.qty,
      price:r.price,
      discount:Number(r.discount||0),
      cgst:Number(r.cgst||0),
      sgst:Number(r.sgst||0),
      igst:Number(r.igst||0),
      total:r.total

    }));

    onSale({

      customer:customer._id,
      gstMode: billMode ? "without":"with",
      items,
      grossTotal,
      discountTotal,
      grandTotal

    });

    setRows([]);
    setCustomer(null);

  };

  return(

    <Paper sx={{p:3,width:"100%"}}>

      <Typography variant="h6" mb={2}>
        Sales Entry
      </Typography>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 12 }}>

          <Autocomplete
            fullWidth
            options={customers}
            getOptionLabel={(c)=>`${c.name} (${c.mobile})`}
            value={customer}
            onChange={(e,v)=>setCustomer(v)}
            renderInput={(params)=>(
              <TextField {...params} label="Customer" fullWidth/>
            )}
          />

        </Grid>

      </Grid>

      <Divider sx={{my:2}}/>

      <TextField
        inputRef={barcodeRef}
        label="Scan Barcode"
        placeholder="Scan product barcode..."
        fullWidth
        sx={{mb:2}}
      />

      <Autocomplete
        options={products}
        getOptionLabel={(p)=>`${p.name} - ${p.productCode}`}
        onChange={(e,v)=>handleProductSelect(v)}
        renderInput={(params)=>(
          <TextField {...params} label="Search Product"/>
        )}
        sx={{mb:3}}
      />

      {rows.map((r,i)=>(

        <Grid
          container
          spacing={2}
          key={i}
          sx={{
            mb:2,
            p:2,
            border:"1px solid #eee",
            borderRadius:2
          }}
        >

          <Grid item xs={12} md={3}>

            <Typography fontWeight="bold">
              {r.product.name}
            </Typography>

            <Typography variant="caption">
              {r.product.productCode}
            </Typography>

            <Typography variant="caption" display="block">
              Stock: {r.stock}
            </Typography>

          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="Qty"
              type="number"
              value={r.qty}
              onChange={(e)=>change(i,"qty",e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="Price"
              value={r.price}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="Discount"
              value={r.discount}
              onChange={(e)=>change(i,"discount",e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="CGST"
              value={r.cgst}
              disabled={billMode}
              onChange={(e)=>change(i,"cgst",e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="SGST"
              value={r.sgst}
              disabled={billMode}
              onChange={(e)=>change(i,"sgst",e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={1}>
            <TextField
              label="IGST"
              value={r.igst}
              disabled={billMode}
              onChange={(e)=>change(i,"igst",e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Total"
              value={r.total.toFixed(2)}
              disabled
              InputProps={{
                style:{
                  fontWeight:"bold",
                  fontSize:"16px",
                  color:"#000"
                }
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <IconButton
              color="error"
              onClick={()=>removeRow(i)}
            >
              <DeleteIcon/>
            </IconButton>
          </Grid>

        </Grid>

      ))}

      <Typography mt={2}>
        <b>Gross Total: ₹{grossTotal.toFixed(2)}</b>
      </Typography>

      <Typography>
        <b>Grand Total: ₹{grandTotal.toFixed(2)}</b>
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{mt:2}}
        onClick={submit}
      >
        Complete Sale
      </Button>

    </Paper>

  );

}
