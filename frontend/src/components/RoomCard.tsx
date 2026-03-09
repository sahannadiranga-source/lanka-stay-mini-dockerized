import type { Room } from "../types/room";

export default function RoomCard({
  room,
  onBook,
}: {
  room: Room;
  onBook: (room: Room) => void;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--gray-200)";
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        {/* Room Image Placeholder */}
        <div
          style={{
            width: "120px",
            height: "100px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            flexShrink: 0,
          }}
        >
          🛏️
        </div>

        {/* Room Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--gray-900)", margin: 0 }}>
                {room.name}
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.5rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                }}
              >
                {room.type}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem", color: "var(--gray-600)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                👥 {room.capacity} guests
              </span>
              <span>•</span>
              <span>Free WiFi</span>
              <span>•</span>
              <span>Breakfast included</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>Price per night</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
                  LKR {room.pricePerNight.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onBook(room)}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "0.625rem 1.5rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Select Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}