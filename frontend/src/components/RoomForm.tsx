import { useEffect, useState } from "react";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";

export default function RoomForm({
  hotels,
  initial,
  onCancel,
  onSave,
}: {
  hotels: Hotel[];
  initial?: Room | null;
  onCancel: () => void;
  onSave: (room: Omit<Room, "id">) => void;
}) {
  const [hotelId, setHotelId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Standard");
  const [pricePerNight, setPricePerNight] = useState<number>(12000);
  const [capacity, setCapacity] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHotelId(initial?.hotelId ?? hotels[0]?.id ?? "");
    setName(initial?.name ?? "");
    setType(initial?.type ?? "Standard");
    setPricePerNight(initial?.pricePerNight ?? 12000);
    setCapacity(initial?.capacity ?? 2);
  }, [initial, hotels]);

  function submit() {
    setError(null);

    if (!hotelId) return setError("Hotel is required.");
    if (!name.trim()) return setError("Room name/number is required.");
    if (!type.trim()) return setError("Room type is required.");
    if (!Number.isFinite(pricePerNight) || pricePerNight <= 0) return setError("Price must be > 0.");
    if (!Number.isFinite(capacity) || capacity <= 0) return setError("Capacity must be > 0.");

    onSave({
      hotelId,
      name: name.trim(),
      type: type.trim(),
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
    });
  }

  return (
    <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>{initial ? "Edit Room" : "Add Room"}</h3>

      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>Hotel</div>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)}>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
        </div>

        <input placeholder="Room name/number (e.g., 101)" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Type (e.g., Deluxe)" value={type} onChange={(e) => setType(e.target.value)} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Price per night (LKR)</div>
            <input
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Capacity</div>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        {error && <div style={{ padding: 10, background: "#f8d7da", borderRadius: 10 }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={submit}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}