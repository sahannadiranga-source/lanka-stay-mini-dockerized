import { useEffect, useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import { apiGet } from "../api/client";
import HotelForm from "../components/HotelForm";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Hotel[]>("/api/hotels");
        setHotels(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = useMemo(
    () => [...hotels].sort((a, b) => a.name.localeCompare(b.name)),
    [hotels]
  );

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }

  function addHotel(payload: Omit<Hotel, "id">) {
    const hotel: Hotel = { id: crypto.randomUUID(), ...payload };
    setHotels((prev) => [hotel, ...prev]);
    setShowForm(false);
    flash("Hotel added (mock).");
  }

  function updateHotel(payload: Omit<Hotel, "id">) {
    if (!editing) return;
    setHotels((prev) =>
      prev.map((h) => (h.id === editing.id ? { ...h, ...payload } : h))
    );
    setEditing(null);
    setShowForm(false);
    flash("Hotel updated (mock).");
  }

  function removeHotel(id: string) {
    const ok = confirm("Delete this hotel?");
    if (!ok) return;
    setHotels((prev) => prev.filter((h) => h.id !== id));
    flash("Hotel deleted (mock).");
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
          Manage Hotels
        </h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Hotel
        </button>
      </div>

      {/* Flash message */}
      {message && (
        <div className="alert alert-success animate-fade-in" style={{ marginBottom: 20 }}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="animate-fade-in" style={{ marginBottom: 20 }}>
          <HotelForm
            initial={editing}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSave={(payload) => {
              if (editing) updateHotel(payload);
              else addHotel(payload);
            }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading hotels…</span>
        </div>
      )}

      {/* Hotel list */}
      <div className="stagger-children" style={{ display: "grid", gap: 14 }}>
        {sorted.map((h) => (
          <div key={h.id} className="card" style={{ padding: "20px 24px" }}>
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
                    fontSize: "1.1rem",
                    marginBottom: 6,
                  }}
                >
                  {h.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: 4 }}>
                  {h.location}
                </div>
                {h.description && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    {h.description}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setEditing(h);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeHotel(h.id)}
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