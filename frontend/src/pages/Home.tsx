import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiGet<Hotel[]>("/api/hotels");
        setHotels(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Hotels</h1>

      {loading && <div style={{ padding: 12 }}>Loading...</div>}

      {error && (
        <div style={{ padding: 12, background: "#f8d7da", borderRadius: 10, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {hotels.map((h) => (
          <div key={h.id} style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
            <h2 style={{ margin: 0 }}>
              <Link to={`/hotels/${h.id}`} style={{ color: "black", textDecoration: "none" }}>
                {h.name}
              </Link>
            </h2>
            <p style={{ margin: "6px 0" }}>
              <b>Location:</b> {h.location}
            </p>
            {h.description && <p style={{ margin: 0 }}>{h.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}