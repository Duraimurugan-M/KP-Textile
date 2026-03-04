import { Grid, Paper, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WarningIcon from "@mui/icons-material/Warning";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

function SummaryCard({ title, value, color, icon }) {
  return (
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
}

export default function InventorySummary({ products = [], purchases = [] }) {
  const totalItems = products.length;
  const totalQty = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
    0
  );
  const lowStock = products.filter((p) => {
    const stock = Number(p.stock || 0);
    return stock > 0 && stock < 10;
  }).length;

  const totalPurchases = purchases.length;
  const purchaseValue = purchases.reduce((sum, purchase) => {
    const total = Number(purchase.totalAmount);

    if (Number.isFinite(total)) {
      return sum + total;
    }

    const itemsTotal = (purchase.items || []).reduce(
      (itemSum, item) =>
        itemSum + Number(item.qty || 0) * Number(item.price || 0),
      0
    );

    return sum + itemsTotal;
  }, 0);

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Products"
          value={totalItems}
          color="#1976d2"
          icon={<CategoryIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Total Qty"
          value={totalQty}
          color="#2e7d32"
          icon={<Inventory2Icon />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Inventory Value"
          value={`Rs ${totalValue.toLocaleString()}`}
          color="#9c27b0"
          icon={<CurrencyRupeeIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Low Stock"
          value={lowStock}
          color="#d32f2f"
          icon={<WarningIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Purchases"
          value={totalPurchases}
          color="#00838f"
          icon={<ShoppingBagIcon />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Purchase Value"
          value={`Rs ${purchaseValue.toLocaleString()}`}
          color="#ef6c00"
          icon={<CurrencyRupeeIcon />}
        />
      </Grid>
    </Grid>
  );
}
