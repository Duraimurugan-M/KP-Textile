import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar.jsx";

const HomeLayout = () => {
  return (
    <div className="min-h-screen md:h-screen flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 w-full pt-16 md:pt-0">

        <div className="w-full px-3 md:px-6 py-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default HomeLayout;
