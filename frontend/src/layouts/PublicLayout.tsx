import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--gray-50)" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1400px", width: "100%", margin: "0 auto", padding: "2rem" }}>
        <Outlet />
      </main>
      <footer
        style={{
          background: "var(--secondary)",
          color: "white",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "white" }}>StayBook</h3>
              <p style={{ fontSize: "0.875rem", opacity: 0.8, lineHeight: 1.6 }}>
                Your trusted partner for finding the perfect accommodation worldwide.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem", color: "white" }}>Support</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.875rem", opacity: 0.8 }}>
                <li style={{ marginBottom: "0.5rem" }}>Help Center</li>
                <li style={{ marginBottom: "0.5rem" }}>Contact Us</li>
                <li style={{ marginBottom: "0.5rem" }}>FAQs</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem", color: "white" }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.875rem", opacity: 0.8 }}>
                <li style={{ marginBottom: "0.5rem" }}>About Us</li>
                <li style={{ marginBottom: "0.5rem" }}>Careers</li>
                <li style={{ marginBottom: "0.5rem" }}>Press</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", opacity: 0.8 }}>
            © 2026 StayBook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}