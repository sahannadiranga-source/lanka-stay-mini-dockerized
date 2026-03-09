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
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 100,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "600px",
          maxWidth: "100%",
          background: "white",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderBottom: "1px solid var(--gray-200)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "0.25rem", fontSize: "1.5rem" }}>Complete your booking</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
              You're just one step away from your perfect stay
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              color: "var(--gray-400)",
              cursor: "pointer",
              padding: "0.25rem",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Room Summary */}
        <div
          style={{
            padding: "1.5rem 2rem",
            background: "var(--gray-50)",
            borderBottom: "1px solid var(--gray-200)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                flexShrink: 0,
              }}
            >
              🛏️
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>{room.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem", color: "var(--gray-600)" }}>
                <span
                  style={{
                    padding: "0.125rem 0.5rem",
                    borderRadius: "var(--radius-sm)",
                    background: "white",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {room.type}
                </span>
                <span>👥 {room.capacity} guests</span>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
                LKR {room.pricePerNight.toLocaleString()}/night
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>Guest information</h3>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                Full Name <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                placeholder="Enter your full name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                style={{ fontSize: "1rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                Email Address <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontSize: "1rem" }}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginTop: "0.25rem" }}>
                Confirmation will be sent to this email
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+94 XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ fontSize: "1rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                  Check-in <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ fontSize: "1rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                  Check-out <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ fontSize: "1rem" }}
                />
              </div>
            </div>

            {/* Price Summary */}
            <div
              style={{
                padding: "1.25rem",
                background: "var(--primary-light)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--primary)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--gray-700)" }}>
                  LKR {room.pricePerNight.toLocaleString()} × {Math.max(0, nights)} {nights === 1 ? "night" : "nights"}
                </span>
                <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>
                  LKR {(room.pricePerNight * Math.max(0, nights)).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "0.75rem",
                  borderTop: "2px solid var(--primary)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--gray-900)" }}>Total</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              onClick={submit}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Confirm Booking
            </button>

            <p style={{ fontSize: "0.75rem", color: "var(--gray-500)", textAlign: "center" }}>
              By clicking "Confirm Booking", you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}