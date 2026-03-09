import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { Room } from "../types/room";

export type CreateRoomRequest = {
  hotelId: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
};

export type UpdateRoomRequest = {
  hotelId: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
};

export async function getRoomsByHotel(hotelId: string): Promise<Room[]> {
  return apiGet<Room[]>(`/api/hotels/${hotelId}/rooms`);
}

export async function createRoom(payload: CreateRoomRequest): Promise<Room> {
  return apiPost<Room, CreateRoomRequest>("/api/rooms", payload, true);
}

export async function updateRoom(id: string, payload: UpdateRoomRequest): Promise<Room> {
  return apiPut<Room, UpdateRoomRequest>(`/api/rooms/${id}`, payload, true);
}

export async function deleteRoom(id: string): Promise<void> {
  return apiDelete(`/api/rooms/${id}`, true);
}
