import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Checkbox,
  Button,
  Stack
} from "@mui/material";

import Barcode from "react-barcode";

export default function ProductList({
  products = [],
  selected = [],
  toggleSelect,
  toggleSelectAll,
  deleteProduct,
  updateProduct
}) {

  const allSelected =
    products.length > 0 && selected.length === products.length;

  return (

    <Paper sx={{p:2}}>

      <Typography variant="h6" mb={2}>
        Product List
      </Typography>

      <TableContainer sx={{overflowX:{xs:"auto",lg:"hidden"}}}>

        <Table size="small" sx={{width:"100%"}}>

          <TableHead>

            <TableRow>

              <TableCell>
                <Checkbox
                  checked={allSelected}
                  onChange={(e)=>toggleSelectAll(e.target.checked)}
                />
              </TableCell>

              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Fabric</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>HSN</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell align="center">Actions</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {products.map((p,i)=>{

              const isSelected = selected.includes(p._id);

              return(

                <TableRow key={p._id} hover>

                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onChange={()=>toggleSelect(p)}
                    />
                  </TableCell>

                  <TableCell>{i+1}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.fabric}</TableCell>
                  <TableCell>{p.color}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.productCode}</TableCell>
                  <TableCell>{p.hsnCode}</TableCell>
                  <TableCell>{p.description}</TableCell>

                  <TableCell>

                    <div id={`barcode-${p._id}`}>

                      <Barcode
                        value={p.productCode}
                        width={1}
                        height={35}
                        fontSize={10}
                      />

                    </div>

                  </TableCell>

                  <TableCell align="center">

                    <Stack spacing={0.5}>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={()=>updateProduct(p)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={()=>deleteProduct(p._id)}
                      >
                        Delete
                      </Button>

                    </Stack>

                  </TableCell>

                </TableRow>

              );

            })}

          </TableBody>

        </Table>

      </TableContainer>

    </Paper>

  );

}