import { useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import { mockHotels as seedHotels, mockRooms as seedRooms } from "../data/mockData";
import RoomForm from "../components/RoomForm";

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export default function AdminRooms() {
  const [hotels] = useState<Hotel[]>(seedHotels);
  const [rooms, setRooms] = useState<Room[]>(seedRooms);

  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const roomsWithHotel = useMemo(() => {
    const map = new Map(hotels.map((h) => [h.id, h]));
    return [...rooms].map((r) => ({ room: r, hotel: map.get(r.hotelId) }));
  }, [rooms, hotels]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  }

  function addRoom(payload: Omit<Room, "id">) {
    const room: Room = { id: newId(), ...payload };
    setRooms((prev) => [room, ...prev]);
    setShowForm(false);
    flash("Room added (mock).");
  }

  function updateRoom(payload: Omit<Room, "id">) {
    if (!editing) return;
    setRooms((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...payload } : r)));
    setEditing(null);
    setShowForm(false);
    flash("Room updated (mock).");
  }

  function removeRoom(id: string) {
    const ok = confirm("Delete this room? (mock)");
    if (!ok) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    flash("Room deleted (mock).");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Manage Rooms</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
        >
          + Add Room
        </button>
      </div>

      {message && (
        <div style={{ padding: 12, background: "#d1e7dd", borderRadius: 10 }}>
          {message}
        </div>
      )}

      {showForm && (
        <RoomForm
          hotels={hotels}
          initial={editing}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
          onSave={(payload) => {
            if (editing) updateRoom(payload);
            else addRoom(payload);
          }}
        />
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {roomsWithHotel.map(({ room, hotel }) => (
          <div key={room.id} style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <b style={{ fontSize: 18 }}>
                  Room {room.name} • {room.type}
                </b>
                <div style={{ marginTop: 4 }}>
                  <b>Hotel:</b> {hotel ? `${hotel.name} (${hotel.location})` : "Unknown"}
                </div>
                <div style={{ marginTop: 4 }}>
                  <b>Capacity:</b> {room.capacity} • <b>Price:</b> LKR {room.pricePerNight.toLocaleString()}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                <button
                  onClick={() => {
                    setEditing(room);
                    setShowForm(true);
                  }}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => removeRoom(room.id)}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        Note: This page uses mock state. Next we will connect it to the .NET API.
      </div>
    </div>
  );
}