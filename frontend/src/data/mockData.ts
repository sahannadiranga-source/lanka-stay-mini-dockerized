import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";
import type { Booking } from "../types/booking";

export const mockBookings: Booking[] = [
  {
    id: "b1",
    roomId: "r1",
    guestName: "Sahan",
    email: "sahan@example.com",
    phone: "07X1234567",
    checkIn: "2026-03-05",
    checkOut: "2026-03-07",
    totalPrice: 36000,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    roomId: "r3",
    guestName: "Alex",
    email: "alex@example.com",
    phone: null,
    checkIn: "2026-03-10",
    checkOut: "2026-03-12",
    totalPrice: 50000,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b3",
    roomId: "r2",
    guestName: "Nimal",
    email: "nimal@example.com",
    phone: "07X9999999",
    checkIn: "2026-03-01",
    checkOut: "2026-03-02",
    totalPrice: 12000,
    status: "CANCELLED",
    createdAt: new Date().toISOString(),
  },
];

export const mockHotels: Hotel[] = [
  { id: "1", name: "Ocean View Hotel", location: "Galle", description: "Near the beach" },
  { id: "2", name: "City Stay", location: "Colombo", description: "Central location" },
  { id: "3", name: "Hilltop Resort", location: "Nuwara Eliya", description: "Cool climate views" },
];

export const mockRooms: Room[] = [
  { id: "r1", hotelId: "1", name: "101", type: "Deluxe", pricePerNight: 18000, capacity: 2 },
  { id: "r2", hotelId: "1", name: "102", type: "Standard", pricePerNight: 12000, capacity: 2 },
  { id: "r3", hotelId: "2", name: "201", type: "Suite", pricePerNight: 25000, capacity: 3 },
  { id: "r4", hotelId: "2", name: "202", type: "Standard", pricePerNight: 14000, capacity: 2 },
  { id: "r5", hotelId: "3", name: "301", type: "Deluxe", pricePerNight: 20000, capacity: 2 },
];