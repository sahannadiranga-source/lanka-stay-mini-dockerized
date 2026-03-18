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
    <div className="card-flat" style={{ padding: 24 }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.125rem",
          marginBottom: 20,
        }}
      >
        {initial ? "Edit Room" : "Add Room"}
      </h3>

      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Hotel *
          </label>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)}>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Room Name / Number *
          </label>
          <input placeholder="e.g. 101" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Room Type *
          </label>
          <input placeholder="e.g. Deluxe, Suite, Standard" value={type} onChange={(e) => setType(e.target.value)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Price per night (LKR)
            </label>
            <input
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        {error && <div className="alert alert-error"> {error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={submit}>
            Save
          </button>
          <button className="btn btn-outline btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}