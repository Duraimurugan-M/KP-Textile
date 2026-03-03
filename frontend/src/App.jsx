import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

// Layout


// Pages
import LoginPage from "./Pages/login/LoginPage.jsx";


import HomeLayout from "./Pages/HomeLayout.jsx"
import Dashboard from "./Pages/Dashboard/Dashboard";
import Product from "./Pages/product/Product";
import VendorModule from "./Pages/Vendor/VendorModule.jsx";
import CustomerModule from "./Pages/Customer/CustomerModule.jsx";
import PurchasePage from "./Pages/purchase/PurchasePage.jsx"
import InventoryPage from "./Pages/inventory/InventoryPage.jsx"
import SalesModule from "./Pages/sales/SalesPage.jsx";
import Invoice from "./Component/Billing/Invoice.jsx";
import CustomerLedger from "./Pages/Ledger/CustomerLedger.jsx";
import VendorLedger from "./Pages/Ledger/VendorLedger.jsx";
import SalesLedger from "./Pages/Ledger/SalesLedger.jsx";
import PurchaseLedger from "./Pages/Ledger/PurchaseLedger.jsx";

const router = createBrowserRouter([
  // 🔁 Redirect root → login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 🔑 Login Page
  {
    path: "/login",
    element: <LoginPage />,
  },

  // 🌐 Main Application (after login)
  {
    path: "/app",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Product />,
      },
      {
  path: "vendors",
  element: <VendorModule />,
},
{
  path: "customers",
  element: <CustomerModule />,
},

{
  path: "purchases",
  element: <PurchasePage />,
},

{
  path: "inventory",
  element: <InventoryPage />,
},

{
  path: "sales",
  element: <SalesModule />,
},

{
  path: "bill",
  element: <Invoice />,
},

{
  path: "customerledger",
  element: <CustomerLedger />,
},
{
  path: "vendorledger",
  element: <VendorLedger />,
},

{
  path: "salesledger",
  element: <SalesLedger />,
},
{
  path: "purchaseledger",
  element: <PurchaseLedger />,
},  
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
