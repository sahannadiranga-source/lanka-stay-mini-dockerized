import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import RoomCard from "../components/RoomCard";
import BookingForm from "../components/BookingForm";

type HotelDetailsDto = Hotel & { rooms: Room[] };

const LOCATION_IMAGES: Record<string, string> = {
  galle:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80&auto=format",
  colombo:
    "https://images.unsplash.com/photo-1580366132481-e8a2f42025e3?w=1400&q=80&auto=format",
  "nuwara eliya":
    "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=1400&q=80&auto=format",
};
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80&auto=format";

function getHeroImage(location?: string) {
  if (!location) return FALLBACK_IMG;
  return LOCATION_IMAGES[location.toLowerCase().trim()] ?? FALLBACK_IMG;
}

export default function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await apiGet<HotelDetailsDto>(`/api/hotels/${id}`);
        setHotel({
          id: details.id,
          name: details.name,
          location: details.location,
          description: details.description,
        });
        setRooms(details.rooms);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const title = useMemo(() => hotel?.name ?? "Hotel Details", [hotel]);

  return (
    <div>
      {/* Hero banner */}
      <section
        className="animate-fade-in"
        style={{
          position: "relative",
          height: "clamp(260px, 38vh, 380px)",
          background: `linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.7) 100%), url('${getHeroImage(hotel?.location)}') center/cover no-repeat`,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 24px 36px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "0.8125rem",
              fontWeight: 500,
              marginBottom: 16,
              textDecoration: "none",
              transition: "all 200ms",
            }}
          >
            ← Back to Hotels
          </Link>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              marginBottom: 8,
            }}
          >
            {title}
          </h1>

          {hotel && (
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span className="badge badge-accent" style={{ fontSize: "0.8125rem" }}>
                 {hotel.location}
              </span>
              {hotel.description && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                  }}
                >
                  {hotel.description}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <span>Loading hotel details…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="alert alert-success animate-fade-in" style={{ marginBottom: 24 }}>
            {message}
          </div>
        )}

        {!loading && !error && hotel && (
          <>
            {/* Rooms Header */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Available Rooms
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Choose Your Room
              </h2>
              <p style={{ fontSize: "0.9375rem" }}>
                {rooms.length > 0
                  ? `${rooms.length} room${rooms.length > 1 ? "s" : ""} available at this property.`
                  : "No rooms are currently available."}
              </p>
            </div>

            {/* Room Cards */}
            <div
              className="stagger-children"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onBook={(r) => setSelectedRoom(r)} />
              ))}
            </div>

            {rooms.length === 0 && (
              <div
                className="card-flat"
                style={{
                  textAlign: "center",
                  padding: 48,
                  color: "var(--color-text-muted)",
                }}
              >
                No rooms found for this hotel.
              </div>
            )}

            {/* Booking Modal */}
            {selectedRoom && (
              <BookingForm
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onSuccess={() => {
                  setSelectedRoom(null);
                  setMessage("Booking confirmed successfully! Check your email for details.");
                  setTimeout(() => setMessage(null), 4000);
                }}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}