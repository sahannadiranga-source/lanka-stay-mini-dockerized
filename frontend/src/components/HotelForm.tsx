import { useEffect, useState } from "react";
import type { Hotel } from "../types/hotel";

export default function HotelForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Hotel | null;
  onCancel: () => void;
  onSave: (hotel: Omit<Hotel, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? "");
    setLocation(initial?.location ?? "");
    setDescription(initial?.description ?? "");
  }, [initial]);

  function submit() {
    setError(null);
    if (!name.trim()) return setError("Name is required.");
    if (!location.trim()) return setError("Location is required.");

    onSave({
      name: name.trim(),
      location: location.trim(),
      description: description.trim() ? description.trim() : null,
    });
  }

  return (
    <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>{initial ? "Edit Hotel" : "Add Hotel"}</h3>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="Hotel name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Location (e.g., Colombo)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

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