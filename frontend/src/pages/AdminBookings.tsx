import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/client";
import type { Booking } from "../types/booking";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";

export default function AdminBookings() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hotelFilter, setHotelFilter] = useState<string>("ALL");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [hotelsData, bookingsData] = await Promise.all([
          apiGet<Hotel[]>("/api/hotels"),
          apiGet<Booking[]>("/api/bookings", true),
        ]);

        setHotels(hotelsData);
        setBookings(bookingsData);

        const roomLists = await Promise.all(
          hotelsData.map((h) => apiGet<{ rooms: Room[] }>(`/api/hotels/${h.id}`))
        );

        const allRooms = roomLists.flatMap((r) => r.rooms);
        setRooms(allRooms);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roomMap = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
  const hotelMap = useMemo(() => new Map(hotels.map((h) => [h.id, h])), [hotels]);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        if (hotelFilter === "ALL") return true;
        const room = roomMap.get(b.roomId);
        return room?.hotelId === hotelFilter;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, hotelFilter, roomMap]);

  return (
    <div>
      {/* Header + filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
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
          Bookings
        </h2>

        <select
          value={hotelFilter}
          onChange={(e) => setHotelFilter(e.target.value)}
          style={{ maxWidth: 280 }}
        >
          <option value="ALL">All Hotels</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} ({h.location})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading bookings…</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div
          className="card-flat"
          style={{ textAlign: "center", padding: 48, color: "var(--color-text-muted)" }}
        >
          No bookings found.
        </div>
      )}

      {/* Booking cards */}
      <div className="stagger-children" style={{ display: "grid", gap: 14 }}>
        {filtered.map((b) => {
          const room = roomMap.get(b.roomId);
          const hotel = room ? hotelMap.get(room.hotelId) : null;

          return (
            <div key={b.id} className="card" style={{ padding: "20px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      marginBottom: 6,
                    }}
                  >
                    {b.guestName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-text-secondary)",
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span> {hotel?.name ?? "—"}</span>
                    <span> Room {room?.name ?? "—"}</span>
                    <span>
                      {b.checkIn} → {b.checkOut}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      marginBottom: 6,
                    }}
                  >
                    LKR {b.totalPrice.toLocaleString()}
                  </div>
                  <span
                    className={`badge ${b.status === "CONFIRMED" ? "badge-success" : "badge-error"
                      }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}