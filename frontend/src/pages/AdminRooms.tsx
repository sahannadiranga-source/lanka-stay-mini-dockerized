import { useEffect, useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import { getHotels } from "../api/hotels";
import { createRoom, updateRoom, deleteRoom } from "../api/rooms";
import RoomForm from "../components/RoomForm";

export default function AdminRooms() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const hotelsData = await getHotels();
      setHotels(hotelsData);

      // Load all rooms from all hotels
      const roomPromises = hotelsData.map(async (h) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/hotels/${h.id}`);
        const data = await response.json();
        return data.rooms || [];
      });

      const roomArrays = await Promise.all(roomPromises);
      const allRooms = roomArrays.flat();
      setRooms(allRooms);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  const roomsWithHotel = useMemo(() => {
    const map = new Map(hotels.map((h) => [h.id, h]));
    return [...rooms].map((r) => ({ room: r, hotel: map.get(r.hotelId) }));
  }, [rooms, hotels]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function addRoom(payload: Omit<Room, "id">) {
    try {
      await createRoom(payload);
      await loadData();
      setShowForm(false);
      flash("✅ Room added successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to add room"}`);
    }
  }

  async function updateRoomData(payload: Omit<Room, "id">) {
    if (!editing) return;
    try {
      await updateRoom(editing.id, payload);
      await loadData();
      setEditing(null);
      setShowForm(false);
      flash("✅ Room updated successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to update room"}`);
    }
  }

  async function removeRoom(id: string) {
    const ok = confirm("Are you sure you want to delete this room?");
    if (!ok) return;
    try {
      await deleteRoom(id);
      await loadData();
      flash("✅ Room deleted successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to delete room"}`);
    }
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0 }}>Manage Rooms</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
          disabled={hotels.length === 0}
        >
          + Add Room
        </button>
      </div>

      {message && (
        <div className={message.includes("✅") ? "alert alert-success" : "alert alert-error"} style={{ marginBottom: "1rem" }}>
          {message}
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-500)" }}>
          Loading rooms...
        </div>
      )}

      {hotels.length === 0 && !loading && (
        <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
          Please create at least one hotel before adding rooms.
        </div>
      )}

      {showForm && hotels.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <RoomForm
            hotels={hotels}
            initial={editing}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSave={(payload) => {
              if (editing) updateRoomData(payload);
              else addRoom(payload);
            }}
          />
        </div>
      )}

      {!loading && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {roomsWithHotel.map(({ room, hotel }) => (
            <div
              key={room.id}
              style={{
                padding: "1.25rem",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-md)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.125rem", margin: 0 }}>Room {room.name}</h3>
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
                  <div style={{ color: "var(--gray-600)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                    🏨 <strong>Hotel:</strong> {hotel ? `${hotel.name} (${hotel.location})` : "Unknown"}
                  </div>
                  <div style={{ color: "var(--gray-600)", fontSize: "0.875rem" }}>
                    👥 <strong>Capacity:</strong> {room.capacity} guests • 💰 <strong>Price:</strong> LKR {room.pricePerNight.toLocaleString()}/night
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                  <button
                    onClick={() => {
                      setEditing(room);
                      setShowForm(true);
                    }}
                    className="btn-secondary btn-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeRoom(room.id)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {roomsWithHotel.length === 0 && !loading && hotels.length > 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-500)" }}>
              No rooms found. Click "Add Room" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}