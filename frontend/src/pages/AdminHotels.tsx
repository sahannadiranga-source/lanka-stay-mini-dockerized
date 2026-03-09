import { useEffect, useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import { getHotels, createHotel, updateHotel, deleteHotel } from "../api/hotels";
import HotelForm from "../components/HotelForm";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHotels();
  }, []);

  async function loadHotels() {
    try {
      setLoading(true);
      setError(null);
      const data = await getHotels();
      setHotels(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  }

  const sorted = useMemo(
    () => [...hotels].sort((a, b) => a.name.localeCompare(b.name)),
    [hotels]
  );

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function addHotel(payload: Omit<Hotel, "id">) {
    try {
      await createHotel(payload);
      await loadHotels();
      setShowForm(false);
      flash("✅ Hotel added successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to add hotel"}`);
    }
  }

  async function updateHotelData(payload: Omit<Hotel, "id">) {
    if (!editing) return;
    try {
      await updateHotel(editing.id, payload);
      await loadHotels();
      setEditing(null);
      setShowForm(false);
      flash("✅ Hotel updated successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to update hotel"}`);
    }
  }

  async function removeHotel(id: string) {
    const ok = confirm("Are you sure you want to delete this hotel? This will also delete all associated rooms.");
    if (!ok) return;
    try {
      await deleteHotel(id);
      await loadHotels();
      flash("✅ Hotel deleted successfully!");
    } catch (e: any) {
      flash(`❌ Error: ${e?.message ?? "Failed to delete hotel"}`);
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
        <h2 style={{ margin: 0 }}>Manage Hotels</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          + Add Hotel
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
          Loading hotels...
        </div>
      )}

      {showForm && (
        <div style={{ marginBottom: "1.5rem" }}>
          <HotelForm
            initial={editing}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSave={(payload) => {
              if (editing) updateHotelData(payload);
              else addHotel(payload);
            }}
          />
        </div>
      )}

      {!loading && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {sorted.map((h) => (
            <div
              key={h.id}
              style={{
                padding: "1.25rem",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-md)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{h.name}</h3>
                  <div style={{ color: "var(--gray-600)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                    📍 <strong>Location:</strong> {h.location}
                  </div>
                  {h.description && (
                    <div style={{ color: "var(--gray-600)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      {h.description}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                  <button
                    onClick={() => {
                      setEditing(h);
                      setShowForm(true);
                    }}
                    className="btn-secondary btn-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeHotel(h.id)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {sorted.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-500)" }}>
              No hotels found. Click "Add Hotel" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}