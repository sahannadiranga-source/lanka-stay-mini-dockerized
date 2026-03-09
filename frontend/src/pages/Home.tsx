import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<Hotel[]>("/api/hotels");
        setHotels(data);
      } catch (e: any) {
        console.error("Failed to load hotels:", e);
        setError(e?.message ?? "Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredHotels = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--secondary) 0%, #1a3a5c 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "3rem 2rem",
          marginBottom: "2rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "white" }}>
            Find your next stay
          </h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem", opacity: 0.9 }}>
            Search deals on hotels, homes, and much more...
          </p>

          {/* Search Box */}
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius-lg)",
              padding: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "700px",
            }}
          >
            <input
              type="text"
              placeholder="Where are you going?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                padding: "0.875rem 1rem",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <button
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "0.875rem 2rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* Results Section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          {searchQuery ? `Search results for "${searchQuery}"` : "Popular destinations"}
        </h2>
        <p style={{ color: "var(--gray-600)" }}>
          {filteredHotels.length} {filteredHotels.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--gray-500)" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid var(--gray-200)",
              borderTop: "4px solid var(--primary)",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <p>Loading properties...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Hotel Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredHotels.map((h) => (
          <Link key={h.id} to={`/hotels/${h.id}`} style={{ textDecoration: "none" }}>
            <div
              className="hotel-card"
              style={{
                background: "white",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image Placeholder */}
              <div
                style={{
                  height: "200px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  position: "relative",
                }}
              >
                🏨
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: "white",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                  }}
                >
                  ♡
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--gray-900)",
                  }}
                >
                  {h.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    marginBottom: "0.5rem",
                    color: "var(--gray-600)",
                    fontSize: "0.875rem",
                  }}
                >
                  <span>📍</span>
                  <span>{h.location}</span>
                </div>

                {h.description && (
                  <p
                    style={{
                      color: "var(--gray-600)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      marginBottom: "1rem",
                      flex: 1,
                    }}
                  >
                    {h.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--gray-200)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>Starting from</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
                      LKR 5,000
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    View Deals
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && filteredHotels.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "var(--radius-lg)",
            color: "var(--gray-500)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--gray-700)" }}>
            No properties found
          </h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}