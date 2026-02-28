import { useMemo, useState } from "react";
import type { Hotel } from "../types/hotel";
import { mockHotels as seedHotels } from "../data/mockData";
import HotelForm from "../components/HotelForm";

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>(seedHotels);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...hotels].sort((a, b) => a.name.localeCompare(b.name)),
    [hotels]
  );

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  }

  function addHotel(payload: Omit<Hotel, "id">) {
    const hotel: Hotel = { id: newId(), ...payload };
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
    const ok = confirm("Delete this hotel? (mock)");
    if (!ok) return;
    setHotels((prev) => prev.filter((h) => h.id !== id));
    flash("Hotel deleted (mock).");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Manage Hotels</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
        >
          + Add Hotel
        </button>
      </div>

      {message && (
        <div style={{ padding: 12, background: "#d1e7dd", borderRadius: 10 }}>
          {message}
        </div>
      )}

      {showForm && (
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
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((h) => (
          <div key={h.id} style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <b style={{ fontSize: 18 }}>{h.name}</b>
                <div style={{ marginTop: 4 }}>
                  <b>Location:</b> {h.location}
                </div>
                {h.description && <div style={{ marginTop: 4, color: "#444" }}>{h.description}</div>}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                <button
                  onClick={() => {
                    setEditing(h);
                    setShowForm(true);
                  }}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => removeHotel(h.id)}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        Note: This page uses mock state. Next we will connect it to the .NET API.
      </div>
    </div>
  );
}