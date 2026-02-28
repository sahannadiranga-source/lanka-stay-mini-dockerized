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
      <Link to="/">← Back</Link>

      <h1 style={{ marginBottom: 6 }}>{title}</h1>

      {loading && <div style={{ padding: 12 }}>Loading...</div>}

      {error && (
        <div style={{ padding: 12, background: "#f8d7da", borderRadius: 10, marginTop: 12 }}>
          {error}
        </div>
      )}

      {!loading && !error && hotel && (
        <>
          <div style={{ color: "#444" }}>
            <b>Location:</b> {hotel.location}
          </div>
          {hotel.description && <p style={{ marginTop: 10 }}>{hotel.description}</p>}

          {message && (
            <div style={{ padding: 12, background: "#d1e7dd", borderRadius: 10, marginTop: 12 }}>
              {message}
            </div>
          )}

          <h2 style={{ marginTop: 18 }}>Rooms</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={(r) => setSelectedRoom(r)} />
            ))}
          </div>

          {rooms.length === 0 && (
            <div style={{ padding: 12, color: "#666" }}>No rooms found.</div>
          )}

          {selectedRoom && (
            <BookingForm
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
              onSuccess={() => {
                setSelectedRoom(null);
                setMessage("Booking created (still mock). Next we will POST to backend.");
                setTimeout(() => setMessage(null), 2500);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}