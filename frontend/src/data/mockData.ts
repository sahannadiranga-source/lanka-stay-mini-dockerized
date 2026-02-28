import type { Hotel } from "../types/hotel";
import type { Room } from "../types/room";

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