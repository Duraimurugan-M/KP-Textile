import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar.jsx";
// import TopBar from "../Pages/TopBar/TopBar.jsx";

const AdminOutlet = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      {/* <TopBar /> */}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden pt-[65px] md:pt-0">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminOutlet;
