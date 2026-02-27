export type Room = {
  id: string;
  hotelId: string;
  name: string;          // e.g. "101" or "Deluxe 1"
  type: string;          // e.g. "Deluxe"
  pricePerNight: number;
  capacity: number;
};