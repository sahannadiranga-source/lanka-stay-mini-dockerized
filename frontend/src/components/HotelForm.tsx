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
    <div
      style={{
        padding: "1.5rem",
        border: "2px solid var(--primary)",
        borderRadius: "var(--radius-lg)",
        background: "var(--gray-50)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "1.25rem" }}>
        {initial ? "Edit Hotel" : "Add New Hotel"}
      </h3>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Hotel Name <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            placeholder="e.g., Grand Hotel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Location <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            placeholder="e.g., Colombo"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            Description
          </label>
          <textarea
            placeholder="Brief description of the hotel (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button onClick={submit} className="btn-primary">
            {initial ? "Update Hotel" : "Create Hotel"}
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}