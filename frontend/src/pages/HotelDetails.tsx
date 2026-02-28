import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockHotels, mockRooms } from "../data/mockData";
import type { Room } from "../types/room";
import RoomCard from "../components/RoomCard";
import BookingForm from "../components/BookingForm";

export default function HotelDetails() {
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const hotel = useMemo(() => mockHotels.find((h) => h.id === id), [id]);
  const rooms = useMemo(() => mockRooms.filter((r) => r.hotelId === id), [id]);

  if (!hotel) {
    return (
      <div>
        <Link to="/">← Back</Link>
        <h2>Hotel not found</h2>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">← Back</Link>

      <h1 style={{ marginBottom: 6 }}>{hotel.name}</h1>
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

      {selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => {
            setSelectedRoom(null);
            setMessage("Booking created (mock). Next we will connect to backend!");
            setTimeout(() => setMessage(null), 2500);
          }}
        />
      )}
    </div>
  );
}