import Navbar from "../../Admin/components/Navbar";
import SidebarClient from "./SidebarClient";
import { Outlet } from "react-router-dom";

const LayoutClient = () => {
  return (
    <div>
      <Navbar />
      <SidebarClient />
      <div style={{ marginLeft: "230px", padding: "20px", marginTop: "60px" }}>
        <Outlet />
      </div>
    </div>
  );
};


export default LayoutClient;
