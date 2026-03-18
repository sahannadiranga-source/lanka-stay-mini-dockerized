import { useEffect, useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import { apiGet } from "../api/client";
import RoomForm from "../components/RoomForm";

export default function AdminRooms() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const hotelsData = await apiGet<Hotel[]>("/api/hotels");
        setHotels(hotelsData);

        // Load rooms from each hotel
        const roomLists = await Promise.all(
          hotelsData.map((h) => apiGet<{ rooms: Room[] }>(`/api/hotels/${h.id}`))
        );
        setRooms(roomLists.flatMap((r) => r.rooms));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roomsWithHotel = useMemo(() => {
    const map = new Map(hotels.map((h) => [h.id, h]));
    return [...rooms].map((r) => ({ room: r, hotel: map.get(r.hotelId) }));
  }, [rooms, hotels]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }

  function addRoom(payload: Omit<Room, "id">) {
    const room: Room = { id: crypto.randomUUID(), ...payload };
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
    const ok = confirm("Delete this room?");
    if (!ok) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    flash("Room deleted (mock).");
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Manage Rooms
        </h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Room
        </button>
      </div>

      {/* Flash */}
      {message && (
        <div className="alert alert-success animate-fade-in" style={{ marginBottom: 20 }}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="animate-fade-in" style={{ marginBottom: 20 }}>
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
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading rooms…</span>
        </div>
      )}

      {/* Rooms list */}
      <div className="stagger-children" style={{ display: "grid", gap: 14 }}>
        {roomsWithHotel.map(({ room, hotel }) => (
          <div key={room.id} className="card" style={{ padding: "20px 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    marginBottom: 6,
                  }}
                >
                  Room {room.name} • {room.type}
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span> {hotel ? `${hotel.name} (${hotel.location})` : "Unknown"}</span>
                  <span>👥 {room.capacity} guests</span>
                  <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                    LKR {room.pricePerNight.toLocaleString()}/night
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setEditing(room);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeRoom(room.id)}
                  style={{ color: "var(--color-error)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 24 }}>
        Note: Add/Edit/Delete uses mock state. Next: connect to the .NET API.
      </div>
    </div>
  );
}