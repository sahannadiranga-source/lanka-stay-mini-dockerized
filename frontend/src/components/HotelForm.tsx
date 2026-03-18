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
    <div className="card-flat" style={{ padding: 24 }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.125rem",
          marginBottom: 20,
        }}
      >
        {initial ? "Edit Hotel" : "Add Hotel"}
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
            Hotel Name *
          </label>
          <input placeholder="e.g. Ocean View Hotel" value={name} onChange={(e) => setName(e.target.value)} />
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
            Location *
          </label>
          <input
            placeholder="e.g. Galle, Colombo, Nuwara Eliya"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            Description (optional)
          </label>
          <textarea
            placeholder="Short description about the hotel…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
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