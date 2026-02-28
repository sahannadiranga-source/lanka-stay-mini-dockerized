import { apiPost } from "./client";
import type { Booking } from "../types/booking";

export type CreateBookingRequest = {
  roomId: string;
  guestName: string;
  email: string;
  phone?: string | null;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
};

export async function createBooking(payload: CreateBookingRequest): Promise<Booking> {
  return apiPost<Booking, CreateBookingRequest>("/api/bookings", payload);
}
