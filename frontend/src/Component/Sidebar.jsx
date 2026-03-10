

// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaFileInvoice,
//   FaShoppingCart,
//   FaBoxOpen,
//   FaBoxes,
//   FaChartBar,
//   FaSignOutAlt,
//   FaBars,
// } from "react-icons/fa";

// const menuItems = [
//   { label: "Dashboard", path: "/app", icon: FaTachometerAlt, exact: true },
//   { label: "Vendor", path: "/app/vendors", icon: FaTachometerAlt },
//   { label: "Customer", path: "/app/customers", icon: FaTachometerAlt },
//   // { label: "Billing", path: "/app/billing", icon: FaFileInvoice },
//   { label: "Sales", path: "/app/sales", icon: FaShoppingCart },
//   { label: "Product", path: "/app/products", icon: FaBoxOpen },
//   { label: "Purchase", path: "/app/purchases", icon: FaBoxOpen },
//   { label: "Inventory", path: "/app/inventory", icon: FaBoxes },
//   {
//     label: "Reports",
//     icon: FaChartBar,
//     children: [
//       { label: "Sales Report", path: "/app/salesledger" },
//       { label: "Purchase Report", path: "/app/purchaseledger" },
//       { label: "Customer Ledger", path: "/app/customerledger" },
//       { label: "Vendor Ledger", path: "/app/vendorledger" },
//     ],
//   },
// ];

// export default function Sidebar() {
//   const [collapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [openReport, setOpenReport] = useState(false);

//   const navigate = useNavigate();

//   return (
//     <>
//       {/* ================= MOBILE TOP BAR ================= */}
//       <header
//         className="md:hidden fixed top-0 left-0 right-0 z-50 text-white"
//         style={{ backgroundColor: "#800E13" }}
//       >
//         <div className="flex items-center justify-between px-4 py-3">
//           <div className="flex items-center gap-2">
//             <img
//               src="https://via.placeholder.com/32"
//               alt="KP Textile"
//               className="w-8 h-8 rounded-full bg-white"
//             />
//             <span className="font-semibold">KP Textile</span>
//           </div>

//           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             <FaBars size={20} />
//           </button>
//         </div>

//         {/* ================= MOBILE MENU ================= */}
//         {mobileMenuOpen && (
//           <div className="px-2 pb-3 space-y-1 ">
//             {menuItems.map((item) => {
//               const Icon = item.icon;

//               // REPORTS DROPDOWN
//               if (item.children) {
//                 return (
//                   <div key={item.label}>
//                     <button
//                       onClick={() => setOpenReport(!openReport)}
//                       className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
//                     >
//                       <Icon size={16} />
//                       <span className="flex-1 text-left">{item.label}</span>
//                       <span>{openReport ? "▾" : "▸"}</span>
//                     </button>

//                     {openReport && (
//                       <div className="ml-6 mt-1 space-y-1">
//                         {item.children.map((sub) => (
//                           <NavLink
//                             key={sub.path}
//                             to={sub.path}
//                             onClick={() => setMobileMenuOpen(false)}
//                             className={({ isActive }) =>
//                               `block px-3 py-2 rounded text-sm ${
//                                 isActive ? "bg-white/20" : "hover:bg-white/10"
//                               }`
//                             }
//                           >
//                             {sub.label}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               }

//               // NORMAL ITEM
//               return (
//                 <NavLink
//                   key={item.label}
//                   to={item.path}
//                   end={item.exact}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-3 py-2 rounded ${
//                       isActive ? "bg-white/20" : "hover:bg-white/10"
//                     }`
//                   }
//                 >
//                   <Icon size={16} />
//                   <span>{item.label}</span>
//                 </NavLink>
//               );
//             })}

//             {/* ===== MOBILE LOGOUT ===== */}
//             <button
//               onClick={() => {
//                 setMobileMenuOpen(false);
//                 navigate("/login");
//               }}
//               className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 hover:bg-white/20 mt-2"
//             >
//               <FaSignOutAlt />
//               <span>Logout</span>
//             </button>
//           </div>
//         )}
//       </header>

//       {/* ================= DESKTOP SIDEBAR ================= */}
//       <aside
//         className={`hidden md:flex md:flex-col h-screen text-white relative ${
//           collapsed ? "w-20" : "w-64"
//         }`}
//         style={{
//           background: "linear-gradient(180deg, #800E13 0%, #640D14 100%)",
//         }}
//       >
//         {/* BRAND */}
//         <div className="flex items-center gap-3 px-4 py-6 border-b border-white/20">
//           <img
//             src="https://via.placeholder.com/40"
//             alt="KP Textile"
//             className="w-10 h-10 rounded-full bg-white"
//           />
//           <div>
//             <h1 className="font-bold text-lg">KP Textile</h1>
//             <p className="text-xs text-white/70">Billing Software</p>
//           </div>
//         </div>

//         {/* MENU */}
//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {menuItems.map((item) => {
//             const Icon = item.icon;

//             if (item.children) {
//               return (
//                 <div key={item.label}>
//                   <button
//                     onClick={() => setOpenReport(!openReport)}
//                     className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
//                   >
//                     <Icon size={16} />
//                     <span className="flex-1 text-left">{item.label}</span>
//                     <span>{openReport ? "▾" : "▸"}</span>
//                   </button>

//                   {openReport && (
//                     <div className="ml-6 mt-1 space-y-1">
//                       {item.children.map((sub) => (
//                         <NavLink
//                           key={sub.path}
//                           to={sub.path}
//                           className="block px-3 py-2 rounded text-sm hover:bg-white/10"
//                         >
//                           {sub.label}
//                         </NavLink>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             return (
//               <NavLink
//                 key={item.label}
//                 to={item.path}
//                 end={item.exact}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-3 py-2 rounded ${
//                     isActive ? "bg-white/20" : "hover:bg-white/10"
//                   }`
//                 }
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* LOGOUT DESKTOP */}
//         <div className="px-3 py-4 border-t border-white/20 mt-auto">
//           <button
//             onClick={() => navigate("/login")}
//             className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 hover:bg-white/20"
//           >
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }


import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTruck,
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaWarehouse,
  FaShoppingCart,
  FaChartBar,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

const menuItems = [
  { label: "Dashboard", path: "/app", icon: FaTachometerAlt, exact: true },
  { label: "Supplier", path: "/app/vendors", icon: FaTruck },
  { label: "Customer", path: "/app/customers", icon: FaUsers },
  { label: "Product", path: "/app/products", icon: FaBoxOpen },
  { label: "Purchase", path: "/app/purchases", icon: FaShoppingBag },
  { label: "Inventory", path: "/app/inventory", icon: FaWarehouse },
  { label: "Sales", path: "/app/sales", icon: FaShoppingCart },
  {
    label: "Reports",
    icon: FaChartBar,
    children: [
      { label: "Sales Report", path: "/app/salesledger" },
      { label: "Purchase Report", path: "/app/purchaseledger" },
      { label: "Customer Ledger", path: "/app/customerledger" },
      { label: "Supplier Ledger", path: "/app/vendorledger" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await customFetch.post("/auth/logout");
      toast.success("Logged out successfully");

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const menuItem =
    "flex items-center gap-4 px-4 py-3 rounded transition-all duration-150 hover:bg-white/10";

  return (
    <>
      {/* MOBILE HEADER */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 text-white"
        style={{ backgroundColor: "#800E13" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/app");
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-[#800E13] font-bold text-sm flex items-center justify-center">
              YS
            </div>
            <span className="font-semibold text-lg">YUVIRAA SILKS</span>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <FaBars size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="px-2 pb-3 space-y-1 max-h-[calc(100vh-60px)] overflow-y-auto hide-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setOpenReport(!openReport)}
                      className={`${menuItem} w-full`}
                    >
                      <Icon size={20} />
                      <span className="flex-1 text-left">{item.label}</span>
                      <span>{openReport ? "▾" : "▸"}</span>
                    </button>

                    {openReport && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded ${
                                isActive ? "bg-white/20" : "hover:bg-white/10"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `${menuItem} ${isActive ? "bg-white/20" : ""}`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className={`${menuItem} w-full bg-white/10 cursor-pointer`}
            >
              <FaSignOutAlt size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className={`hidden md:flex md:flex-col h-screen text-white transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
        style={{
          background: "linear-gradient(180deg,#800E13 0%,#640D14 100%)",
        }}
      >
        {/* LOGO */}
        <div
          className="flex items-center justify-center py-6 border-b border-white/20 cursor-pointer"
          onClick={() => navigate("/app")}
        >
          <div className="w-12 h-12 rounded-full bg-white text-[#800E13] font-bold text-lg flex items-center justify-center">
            YS
          </div>

          {!collapsed && (
            <div className="ml-3">
              <h1 className="font-bold text-lg">YUVIRAA SILKS</h1>
              <p className="text-xs text-white/70">Billing Software</p>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenReport(!openReport)}
                    className={`${menuItem} w-full ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    <Icon size={20} />

                    {!collapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && <span>{openReport ? "▾" : "▸"}</span>}
                  </button>

                  {!collapsed && openReport && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded ${
                              isActive ? "bg-white/20" : "hover:bg-white/10"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `${menuItem} ${collapsed ? "justify-center" : ""} ${
                    isActive ? "bg-white/20" : ""
                  }`
                }
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="px-2 py-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className={`${menuItem} w-full ${
              collapsed ? "justify-center" : ""
            } bg-white/10 cursor-pointer`}
          >
            <FaSignOutAlt size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
