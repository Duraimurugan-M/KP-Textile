import { Grid, Paper, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WarningIcon from "@mui/icons-material/Warning";
import CategoryIcon from "@mui/icons-material/Category";

export default function InventorySummary({ products }) {
  const totalItems = products.length;
  const totalQty = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 5).length;

  const Card = ({ title, value, color, icon }) => (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 2,
          background: color,
          color: "#fff",
        }}
      >
        {icon}
      </Paper>

      <div>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
      </div>
    </Paper>
  );

  return (
    <Grid container spacing={3} sx={{ mt: 1 }} >
      <Grid item xs={12} md={3} sx={{width:200}}>
        <Card
          title="Products"
          value={totalItems}
          color="#1976d2"
          icon={<CategoryIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3} sx={{width:200}}>
        <Card
          title="Total Qty"
          value={totalQty}
          color="#2e7d32"
          icon={<Inventory2Icon />}
        />
      </Grid>

      <Grid item xs={12} md={3} >
        <Card
          title="Inventory Value"
          value={`₹${totalValue}`}
          color="#9c27b0"
          icon={<CurrencyRupeeIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3} sx={{width:200}}>
        <Card
          title="Low Stock"
          value={lowStock}
          color="#d32f2f"
          icon={<WarningIcon />}
        />
      </Grid>
    </Grid>
  );
}