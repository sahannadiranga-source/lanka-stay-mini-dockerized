import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {[
          {
            icon: "",
            title: "Manage Hotels",
            desc: "Add, edit, or remove hotel properties.",
            to: "/admin/hotels",
            color: "var(--color-primary)",
          },
          {
            icon: "",
            title: "Manage Rooms",
            desc: "Configure rooms, pricing, and capacity.",
            to: "/admin/rooms",
            color: "var(--color-accent)",
          },
          {
            icon: "",
            title: "View Bookings",
            desc: "Review all guest bookings and statuses.",
            to: "/admin/bookings",
            color: "var(--color-success)",
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="card"
              style={{
                cursor: "pointer",
                padding: "28px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{item.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  marginBottom: 8,
                  color: "var(--color-text)",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}