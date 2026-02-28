import { useMemo, useState } from "react";
import type { Booking } from "../types/booking";
import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import { mockBookings as seedBookings, mockHotels, mockRooms } from "../data/mockData";

export default function AdminBookings() {
  const [hotels] = useState<Hotel[]>(mockHotels);
  const [rooms] = useState<Room[]>(mockRooms);
  const [bookings] = useState<Booking[]>(seedBookings);

  const [hotelFilter, setHotelFilter] = useState<string>("ALL");

  const roomMap = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
  const hotelMap = useMemo(() => new Map(hotels.map((h) => [h.id, h])), [hotels]);

  const rows = useMemo(() => {
    return bookings
      .map((b) => {
        const room = roomMap.get(b.roomId);
        const hotel = room ? hotelMap.get(room.hotelId) : undefined;
        return { booking: b, room, hotel };
      })
      .filter(({ hotel }) => (hotelFilter === "ALL" ? true : hotel?.id === hotelFilter))
      .sort((a, b) => b.booking.createdAt.localeCompare(a.booking.createdAt));
  }, [bookings, roomMap, hotelMap, hotelFilter]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Bookings</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#444" }}>Filter hotel:</span>
          <select value={hotelFilter} onChange={(e) => setHotelFilter(e.target.value)}>
            <option value="ALL">All</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr", gap: 10, fontWeight: 700 }}>
          <div>Guest</div>
          <div>Hotel / Room</div>
          <div>Dates</div>
          <div>Total</div>
          <div>Status</div>
          <div>Created</div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {rows.map(({ booking, room, hotel }) => (
            <div
              key={booking.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr",
                gap: 10,
                paddingTop: 10,
                borderTop: "1px solid #eee",
              }}
            >
              <div>
                <b>{booking.guestName}</b>
                <div style={{ fontSize: 12, color: "#666" }}>{booking.email}</div>
                {booking.phone && <div style={{ fontSize: 12, color: "#666" }}>{booking.phone}</div>}
              </div>

              <div>
                <div><b>{hotel ? hotel.name : "Unknown hotel"}</b></div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Room {room ? room.name : "?"} • {room ? room.type : "?"}
                </div>
              </div>

              <div>
                <div><b>{booking.checkIn}</b> → <b>{booking.checkOut}</b></div>
              </div>

              <div>
                LKR <b>{booking.totalPrice.toLocaleString()}</b>
              </div>

              <div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    fontSize: 12,
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(booking.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div style={{ padding: 12, color: "#666" }}>No bookings found for this filter.</div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        Note: This page uses mock data. Next we will connect to the .NET API and show real bookings.
      </div>
    </div>
  );
}