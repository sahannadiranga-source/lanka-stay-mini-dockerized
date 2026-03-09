import { Link, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  textDecoration: "none",
  padding: "0.5rem 1rem",
  borderRadius: "var(--radius-md)",
  fontWeight: 500,
  fontSize: "0.875rem",
  color: isActive ? "var(--primary)" : "var(--gray-700)",
  transition: "all 0.2s ease",
  borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
});

export default function Navbar() {
  return (
    <nav
      style={{
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0.75rem 2rem",
          gap: "var(--spacing-lg)",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--primary)",
            fontSize: "1.75rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          StayBook
        </Link>

        <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto", alignItems: "center" }}>
          <NavLink to="/" end style={linkStyle}>
            Hotels
          </NavLink>
          <NavLink to="/admin" style={linkStyle}>
            Admin
          </NavLink>
          <button
            style={{
              marginLeft: "1rem",
              padding: "0.5rem 1.25rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}