import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";

const mockHotels: Hotel[] = [
  { id: "1", name: "Ocean View Hotel", location: "Galle", description: "Near the beach" },
  { id: "2", name: "City Stay", location: "Colombo", description: "Central location" },
  { id: "3", name: "Hilltop Resort", location: "Nuwara Eliya", description: "Cool climate views" },
];

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // backend will provide this later
        const data = await apiGet<Hotel[]>("/api/hotels");
        setHotels(data);
      } catch {
        // fallback until backend is ready
        setHotels(mockHotels);
        setError("Backend not connected yet. Showing mock data.");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Hotels</h1>
      {error && (
        <div style={{ padding: 12, background: "#fff3cd", borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {hotels.map((h) => (
          <div key={h.id} style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
            <h2 style={{ margin: 0 }}>{h.name}</h2>
            <p style={{ margin: "6px 0" }}><b>Location:</b> {h.location}</p>
            {h.description && <p style={{ margin: 0 }}>{h.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}