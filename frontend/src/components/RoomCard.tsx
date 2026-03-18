import type { Room } from "../types/room";

const ROOM_TYPE_ICONS: Record<string, string> = {
  deluxe: "",
  suite: "",
  standard: "",
};

function getRoomIcon(type: string) {
  return ROOM_TYPE_ICONS[type.toLowerCase()] ?? "";
}

export default function RoomCard({
  room,
  onBook,
}: {
  room: Room;
  onBook: (room: Room) => void;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Room type header bar */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary-50), var(--color-surface-alt))",
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem" }}>{getRoomIcon(room.type)}</span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "var(--color-text)",
              }}
            >
              Room {room.name}
            </div>
            <span className="badge badge-primary" style={{ marginTop: 4 }}>
              {room.type}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "20px", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "var(--color-surface-alt)",
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Capacity
            </div>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>
              👥 {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface-alt)",
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Per Night
            </div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-primary)" }}>
              LKR {room.pricePerNight.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onBook(room)}
          style={{
            width: "100%",
            borderRadius: "var(--radius-sm)",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}