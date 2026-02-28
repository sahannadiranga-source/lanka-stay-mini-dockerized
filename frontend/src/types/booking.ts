export type BookingStatus = "CONFIRMED" | "CANCELLED";

export type Booking = {
  id: string;
  roomId: string;

  guestName: string;
  email: string;
  phone?: string | null;

  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD

  totalPrice: number;
  status: BookingStatus;
  createdAt: string; // ISO string
};