import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "var(--color-text)",
          color: "rgba(255,255,255,0.6)",
          padding: "48px 24px 32px",
          marginTop: 64,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "white",
                marginBottom: 12,
              }}
            >
              Lanka Stay
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
              Discover the best hotels across Sri Lanka.
              From coastal retreats in Galle to hill country resorts in Nuwara Eliya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 16,
              }}
            >
              Quick Links
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
              <span>Hotels</span>
              <span>About Us</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 16,
              }}
            >
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
              <span> hello@lankastay.lk</span>
              <span> +94 11 234 5678</span>
              <span> Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "36px auto 0",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          © {new Date().getFullYear()} Lanka Stay. All rights reserved.
        </div>
      </footer>
    </div>
  );
}