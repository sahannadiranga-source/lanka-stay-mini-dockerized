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
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = useMemo(
    () => Math.max(0, nights) * room.pricePerNight,
    [nights, room.pricePerNight]
  );

  async function submit() {
    setError(null);

    if (!guestName.trim()) return setError("Guest name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!checkIn || !checkOut) return setError("Check-in and check-out dates are required.");
    if (new Date(checkOut) <= new Date(checkIn))
      return setError("Check-out must be after check-in.");
    if (nights <= 0) return setError("Booking must be at least 1 night.");

    try {
      setSubmitting(true);
      await createBooking({
        roomId: room.id,
        guestName: guestName.trim(),
        email: email.trim(),
        phone: phone.trim() ? phone.trim() : null,
        checkIn,
        checkOut,
      });
      onSuccess();
    } catch (e: any) {
      const msg = e?.message ?? "Booking failed.";
      setError(msg.includes("409") ? "Room is not available for those dates." : msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Book Your Stay
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Room {room.name}
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge badge-primary">{room.type}</span>
              <span className="badge badge-accent">
                👥 {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
              </span>
              <span className="badge" style={{ background: "#f0fdfa", color: "var(--color-primary)" }}>
                LKR {room.pricePerNight.toLocaleString()}/night
              </span>
            </div>
          </div>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ fontSize: "1.25rem", padding: "4px 10px" }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "grid", gap: 14 }}>
          {/* Guest Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Guest Name *
            </label>
            <input
              placeholder="Enter your full name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Email *
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Phone (optional)
            </label>
            <input
              type="tel"
              placeholder="+94 77 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: 6,
                }}
              >
                Check-in *
              </label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: 6,
                }}
              >
                Check-out *
              </label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          {/* Price Summary */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--color-primary-50), var(--color-surface-alt))",
              padding: "18px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-primary-100)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                marginBottom: 8,
                color: "var(--color-text-secondary)",
              }}
            >
              <span>
                {Math.max(0, nights)} night{nights !== 1 ? "s" : ""} × LKR{" "}
                {room.pricePerNight.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--color-text)",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.375rem",
                  color: "var(--color-primary)",
                }}
              >
                LKR {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error">⚠️ {error}</div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={submitting}
              style={{
                flex: 1,
                borderRadius: "var(--radius-sm)",
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}