import { Box, Typography, Button } from "@mui/material";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export default function BarcodeLabel({ product }) {

const printBarcode = async () => {
  try {

    const element = document.getElementById("barcode-label");

    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
      <head>
        <title>Print Barcode</title>
        <style>
          body{
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
          }
          img{
            width:50mm;
            height:25mm;
          }
        </style>
      </head>
      <body>
        <img src="${data}" />
      </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);

  } catch (error) {
    console.error(error);
    toast.error("Failed to generate barcode print preview");
  }
};

  if (!product) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        id="barcode-label"
        sx={{
          width: "50mm",
          height: "25mm",
          padding: "2px",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <Typography fontSize={8} fontWeight="bold">
          YUVIRAA SILKS
        </Typography>

        <Typography fontSize={7}>{product.name}</Typography>

        <Typography fontSize={10} fontWeight="bold">MRP Rs {product.price}</Typography>

        <Barcode
          value={product.productCode}
          width={2}
          height={60}
          displayValue={false}
          margin={0}
        />

        <Typography fontSize={7}>{product.productCode}</Typography>
      </Box>

      <Button sx={{ mt: 2 }} variant="contained" onClick={printBarcode}>
        Print Barcode
      </Button>
    </Box>
  );
}
