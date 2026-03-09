import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api/client";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import RoomCard from "../components/RoomCard";
import BookingForm from "../components/BookingForm";

type HotelDetailsDto = Hotel & { rooms: Room[] };

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

        // Option A: get hotel + rooms in one call
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
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--primary)",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        ← Back to search results
      </Link>

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
          <p>Loading hotel details...</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && hotel && (
        <>
          {/* Hotel Header with Image Gallery */}
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Image Gallery */}
            <div
              style={{
                height: "400px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6rem",
                position: "relative",
              }}
            >
              🏨
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  right: "1rem",
                  background: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--gray-700)",
                  cursor: "pointer",
                }}
              >
                📷 View all photos
              </div>
            </div>

            {/* Hotel Info */}
            <div style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{title}</h1>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: "#fbbf24", fontSize: "1.25rem" }}>★</span>
                      ))}
                    </div>
                    <span style={{ color: "var(--gray-600)", fontSize: "0.875rem" }}>
                      (128 reviews)
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ color: "var(--gray-500)", fontSize: "1.25rem" }}>📍</span>
                    <span style={{ color: "var(--gray-700)", fontWeight: 500, fontSize: "1rem" }}>
                      {hotel.location}
                    </span>
                    <a href="#" style={{ color: "var(--primary)", fontSize: "0.875rem", marginLeft: "0.5rem" }}>
                      Show on map
                    </a>
                  </div>
                  
                  {hotel.description && (
                    <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--gray-600)", marginBottom: "1rem" }}>
                      {hotel.description}
                    </p>
                  )}

                  {/* Amenities */}
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                    {["Free WiFi", "Pool", "Parking", "Restaurant", "Gym", "Spa"].map((amenity) => (
                      <div key={amenity} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-700)", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--success)" }}>✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  style={{
                    background: "white",
                    border: "1px solid var(--gray-300)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  ♡ Save
                </button>
              </div>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}

          {/* Rooms Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Choose your room</h2>
            <p style={{ color: "var(--gray-600)" }}>
              {rooms.length} room {rooms.length === 1 ? "type" : "types"} available
            </p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={(r) => setSelectedRoom(r)} />
            ))}
          </div>

          {rooms.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                background: "white",
                borderRadius: "var(--radius-lg)",
                color: "var(--gray-500)",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                No rooms available
              </h3>
              <p>Please check back later or contact the hotel directly</p>
            </div>
          )}

          {selectedRoom && (
            <BookingForm
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
              onSuccess={() => {
                setSelectedRoom(null);
                setMessage("🎉 Booking confirmed! Check your email for details.");
                setTimeout(() => setMessage(null), 4000);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}