export default function AdminHome() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-xl)",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--gray-200)",
      }}
    >
      <div style={{ textAlign: "center", padding: "var(--spacing-2xl)" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--spacing-md)" }}>🎯</div>
        <h2 style={{ marginBottom: "var(--spacing-md)" }}>Welcome to Admin Dashboard</h2>
        <p style={{ color: "var(--gray-600)", fontSize: "1.125rem", marginBottom: "var(--spacing-lg)" }}>
          Select a section from the navigation above to manage your hotel booking system
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)" }}>
          <div style={{ padding: "var(--spacing-lg)", background: "var(--gray-50)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏨</div>
            <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>Hotels</div>
            <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>Manage properties</div>
          </div>
          
          <div style={{ padding: "var(--spacing-lg)", background: "var(--gray-50)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛏️</div>
            <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>Rooms</div>
            <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>Configure rooms</div>
          </div>
          
          <div style={{ padding: "var(--spacing-lg)", background: "var(--gray-50)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
            <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>Bookings</div>
            <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>View reservations</div>
          </div>
        </div>
      </div>
    </div>
  );
}