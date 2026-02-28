import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
        <h1 style={{ marginTop: 0 }}>Admin</h1>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Link to="/admin/hotels">Hotels</Link>
          <Link to="/admin/rooms">Rooms</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}