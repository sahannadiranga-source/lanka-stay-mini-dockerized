import { Link, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: isActive ? "#f2f2f2" : "white",
  color: "black",
});

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #eee",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <b>StayBook Mini</b>
      </Link>

      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
        <NavLink to="/" style={linkStyle}>
          Hotels
        </NavLink>
        <NavLink to="/admin" style={linkStyle}>
          Admin
        </NavLink>
      </div>
    </div>
  );
}