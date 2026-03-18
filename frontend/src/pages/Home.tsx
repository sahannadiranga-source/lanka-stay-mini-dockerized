import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";

/* Unsplash images per location for hotel cards */
const LOCATION_IMAGES: Record<string, string> = {
  galle:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80&auto=format",
  colombo:
    "https://images.unsplash.com/photo-1580366132481-e8a2f42025e3?w=640&q=80&auto=format",
  "nuwara eliya":
    "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=640&q=80&auto=format",
};
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=640&q=80&auto=format";

function getHotelImage(location: string) {
  const key = location.toLowerCase().trim();
  return LOCATION_IMAGES[key] ?? FALLBACK_IMG;
}

/* Location emoji */
function getLocationIcon(location: string) {
  const key = location.toLowerCase();
  if (key.includes("galle")) return "";
  if (key.includes("colombo")) return "";
  if (key.includes("nuwara") || key.includes("eliya")) return "";
  return "";
}

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
      {/* ====== HERO SECTION ====== */}
      <section
        style={{
          position: "relative",
          height: "clamp(420px, 55vh, 600px)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 118, 110, 0.55)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80&auto=format') center/cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Decorative floating circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(212, 168, 83, 0.12)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(20, 184, 166, 0.15)",
            filter: "blur(50px)",
          }}
        />

        <div
          className="animate-fade-in-up"
          style={{ position: "relative", zIndex: 1, padding: "0 24px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.9)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              marginBottom: 20,
              letterSpacing: "0.04em",
            }}
          >
             Discover Sri Lanka's Finest Hotels
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              marginBottom: 16,
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            Your Perfect Stay
            <br />
            <span style={{ color: "var(--color-accent-light)" }}>Awaits</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)",
              color: "rgba(255,255,255,0.8)",
              maxWidth: 520,
              margin: "0 auto 28px",
              lineHeight: 1.7,
            }}
          >
            From pristine beaches to misty mountains—book handpicked hotels
            across the pearl of the Indian Ocean.
          </p>

          <a
            href="#hotels"
            className="btn btn-accent"
            style={{
              fontSize: "1rem",
              padding: "14px 36px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Explore Hotels ↓
          </a>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border-light)",
          padding: "28px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 6vw, 80px)",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "", value: "3+", label: "Hotels" },
            { icon: "", value: "15+", label: "Rooms" },
            { icon: "", value: "3", label: "Destinations" },
            { icon: "", value: "4.8", label: "Avg Rating" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== HOTELS SECTION ====== */}
      <section
        id="hotels"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Our Properties
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Handpicked Hotels
          </h2>
          <p style={{ maxWidth: 540, margin: "0 auto", fontSize: "0.9375rem" }}>
            Every property is carefully selected for quality, comfort, and
            an unforgettable Sri Lankan experience.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <span>Loading hotels…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ maxWidth: 600, margin: "0 auto" }}>
             {error}
          </div>
        )}

        {/* Hotel Cards */}
        {!loading && !error && (
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 28,
            }}
          >
            {hotels.map((h) => (
              <Link
                key={h.id}
                to={`/hotels/${h.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
                  {/* Image */}
                  <div
                    style={{
                      height: 200,
                      background: `linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.55) 100%), url('${getHotelImage(h.location)}') center/cover no-repeat`,
                      position: "relative",
                    }}
                  >
                    <div
                      className="badge badge-accent"
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                      }}
                    >
                      {getLocationIcon(h.location)} {h.location}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "var(--color-text)",
                      }}
                    >
                      {h.name}
                    </h3>
                    {h.description && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.6,
                          marginBottom: 16,
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
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--color-primary)",
                          fontWeight: 600,
                        }}
                      >
                        View rooms →
                      </span>
                      <span className="badge badge-primary">Available</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "var(--color-text-muted)",
            }}
          >
            No hotels found. Check back soon!
          </div>
        )}
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-50), var(--color-surface))",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Why Book With Us
            </h2>
            <p style={{ maxWidth: 500, margin: "0 auto", fontSize: "0.9375rem" }}>
              Experience seamless booking with trusted partners across Sri Lanka.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "",
                title: "Secure Booking",
                desc: "Your data is protected with state-of-the-art security.",
              },
              {
                icon: "",
                title: "Best Prices",
                desc: "Competitive rates with no hidden fees or surprises.",
              },
              {
                icon: "",
                title: "Quality Assurance",
                desc: "Every hotel is personally vetted for quality and service.",
              },
              {
                icon: "",
                title: "24/7 Support",
                desc: "Round-the-clock assistance for worry-free travel.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  border: "1px solid rgba(20, 184, 166, 0.12)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{item.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.8125rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}