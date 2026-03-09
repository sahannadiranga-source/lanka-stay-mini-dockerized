import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const adminLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  textDecoration: "none",
  padding: "0.5rem 1rem",
  borderRadius: "var(--radius-md)",
  fontWeight: 500,
  fontSize: "0.875rem",
  background: isActive ? "var(--primary)" : "white",
  color: isActive ? "white" : "var(--gray-700)",
  border: "1px solid",
  borderColor: isActive ? "var(--primary)" : "var(--gray-300)",
  transition: "all 0.2s ease",
  display: "inline-block",
});

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "var(--spacing-xl) var(--spacing-lg)" }}>
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--gray-600)" }}>Manage hotels, rooms, and bookings</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            marginBottom: "var(--spacing-xl)",
            padding: "var(--spacing-sm)",
            background: "white",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--gray-200)",
          }}
        >
          <NavLink to="/admin/hotels" style={adminLinkStyle}>
            🏨 Hotels
          </NavLink>
          <NavLink to="/admin/rooms" style={adminLinkStyle}>
            🛏️ Rooms
          </NavLink>
          <NavLink to="/admin/bookings" style={adminLinkStyle}>
            📅 Bookings
          </NavLink>
        </div>

        <Outlet />
      </main>
    </div>
  );
}