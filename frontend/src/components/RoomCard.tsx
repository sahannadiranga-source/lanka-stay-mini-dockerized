import type { Room } from "../types/room";

export default function RoomCard({
  room,
  onBook,
}: {
  room: Room;
  onBook: (room: Room) => void;
}) {
  return (
    <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <b>Room {room.name}</b> • {room.type} • {room.capacity} guests
          <div style={{ marginTop: 6 }}>
            <span>Price per night: </span>
            <b>LKR {room.pricePerNight.toLocaleString()}</b>
          </div>
        </div>

        <button
          onClick={() => onBook(room)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
}