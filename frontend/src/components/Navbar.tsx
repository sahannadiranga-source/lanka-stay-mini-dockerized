import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-light)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >

        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div>
            <img src="/logo.png" alt="Company Logo" style={{ width: 38, height: 38 }} />
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1.1,
              }}
            >
              Lanka Stay
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--color-text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Premium Hotel Booking
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StyledNavLink to="/" label="Hotels" end />
        </div>
      </div>
    </nav>
  );
}

function StyledNavLink({
  to,
  label,
  end,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        textDecoration: "none",
        padding: "8px 20px",
        borderRadius: "var(--radius-full)",
        fontSize: "0.875rem",
        fontWeight: 500,
        letterSpacing: "0.01em",
        color: isActive ? "white" : "var(--color-text-secondary)",
        background: isActive
          ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
          : "transparent",
        boxShadow: isActive
          ? "0 2px 8px rgba(15, 118, 110, 0.25)"
          : "none",
        transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      })}
    >
      {label}
    </NavLink>
  );
}