import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar.jsx";

const HomeLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 w-full">

        <div className="w-full px-6 py-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default HomeLayout;