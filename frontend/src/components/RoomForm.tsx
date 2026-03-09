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
    <div
      style={{
        padding: "1.5rem",
        border: "2px solid var(--primary)",
        borderRadius: "var(--radius-lg)",
        background: "var(--gray-50)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "1.25rem" }}>
        {initial ? "Edit Room" : "Add New Room"}
      </h3>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Hotel <span style={{ color: "var(--danger)" }}>*</span>
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
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Room Name/Number <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            placeholder="e.g., 101, Suite A"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Room Type <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            placeholder="e.g., Standard, Deluxe, Suite"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
              Price per Night (LKR) <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
              Capacity (Guests) <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button onClick={submit} className="btn-primary">
            {initial ? "Update Room" : "Create Room"}
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}