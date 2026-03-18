import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const adminLinks = [
  { to: "/admin/hotels", label: " Hotels" },
  { to: "/admin/rooms", label: " Rooms" },
  { to: "/admin/bookings", label: " Bookings" },
];

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* Admin Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Dashboard
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Admin Panel
          </h1>
        </div>

        {/* Tab Nav */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 28,
            borderBottom: "1px solid var(--color-border-light)",
            paddingBottom: 0,
          }}
        >
          {adminLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                textDecoration: "none",
                padding: "10px 20px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                marginBottom: -1,
                transition: "all 200ms",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </main>
    </div>
  );
}