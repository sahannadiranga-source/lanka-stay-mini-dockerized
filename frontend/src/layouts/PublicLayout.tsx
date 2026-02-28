import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}