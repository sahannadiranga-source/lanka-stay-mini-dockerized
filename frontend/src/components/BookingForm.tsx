import { useMemo, useState } from "react";
import type { Room } from "../types/room";
import { createBooking } from "../api/bookings";

function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return isFinite(nights) ? nights : 0;
}

export default function BookingForm({
  room,
  onClose,
  onSuccess,
}: {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = useMemo(() => Math.max(0, nights) * room.pricePerNight, [nights, room.pricePerNight]);

async function submit() {
  setError(null);

  if (!guestName.trim()) return setError("Guest name is required.");
  if (!email.trim()) return setError("Email is required.");
  if (!checkIn || !checkOut) return setError("Check-in and check-out dates are required.");
  if (new Date(checkOut) <= new Date(checkIn)) return setError("Check-out must be after check-in.");
  if (nights <= 0) return setError("Booking must be at least 1 night.");

  try {
    await createBooking({
      roomId: room.id,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim() ? phone.trim() : null,
      checkIn,
      checkOut,
    });

    onSuccess(); // ✅ only once
  } catch (e: any) {
    const msg = e?.message ?? "Booking failed.";
    setError(msg.includes("409") ? "Room is not available for those dates." : msg);
  }
}

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ width: 520, maxWidth: "100%", background: "white", borderRadius: 14, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <h2 style={{ margin: 0 }}>Book Room {room.name}</h2>
            <div style={{ marginTop: 6, color: "#444" }}>
              {room.type} • {room.capacity} guests • LKR {room.pricePerNight.toLocaleString()} / night
            </div>
          </div>
          <button onClick={onClose} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "8px 10px" }}>
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <input placeholder="Guest name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Check-in</div>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Check-out</div>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          <div style={{ padding: 12, background: "#f7f7f7", borderRadius: 10 }}>
            <div>Nights: <b>{Math.max(0, nights)}</b></div>
            <div>Total: <b>LKR {total.toLocaleString()}</b></div>
          </div>

          {error && <div style={{ padding: 10, background: "#f8d7da", borderRadius: 10 }}>{error}</div>}

          <button
            onClick={submit}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Confirm booking
          </button>
        </div>
      </div>
    </div>
  );
}