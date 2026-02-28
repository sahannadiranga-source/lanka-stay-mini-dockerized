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

        // load all rooms from hotels details
        const roomLists = await Promise.all(
          hotelsData.map(h => apiGet<{ rooms: Room[] }>(`/api/hotels/${h.id}`))
        );

        const allRooms = roomLists.flatMap(r => r.rooms);
        setRooms(allRooms);

      } catch (e: any) {
        setError(e?.message ?? "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);
  const hotelMap = useMemo(() => new Map(hotels.map(h => [h.id, h])), [hotels]);

  const filtered = useMemo(() => {
    return bookings
      .filter(b => {
        if (hotelFilter === "ALL") return true;
        const room = roomMap.get(b.roomId);
        return room?.hotelId === hotelFilter;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, hotelFilter, roomMap]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Bookings</h2>

      <div>
        <select value={hotelFilter} onChange={e => setHotelFilter(e.target.value)}>
          <option value="ALL">All Hotels</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>
              {h.name} ({h.location})
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ background: "#f8d7da", padding: 10 }}>{error}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(b => {
          const room = roomMap.get(b.roomId);
          const hotel = room ? hotelMap.get(room.hotelId) : null;

          return (
            <div key={b.id} style={{ padding: 14, border: "1px solid #ddd", borderRadius: 12 }}>
              <b>{b.guestName}</b>
              <div>{hotel?.name} • Room {room?.name}</div>
              <div>{b.checkIn} → {b.checkOut}</div>
              <div>LKR {b.totalPrice.toLocaleString()}</div>
              <div>Status: {b.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}