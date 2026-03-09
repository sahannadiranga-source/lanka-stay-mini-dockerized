import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { Hotel } from "../types/hotel";

export type CreateHotelRequest = {
  name: string;
  location: string;
  description?: string | null;
};

export type UpdateHotelRequest = {
  name: string;
  location: string;
  description?: string | null;
};

export async function getHotels(): Promise<Hotel[]> {
  return apiGet<Hotel[]>("/api/hotels");
}

export async function getHotel(id: string): Promise<Hotel> {
  return apiGet<Hotel>(`/api/hotels/${id}`);
}

export async function createHotel(payload: CreateHotelRequest): Promise<Hotel> {
  return apiPost<Hotel, CreateHotelRequest>("/api/hotels", payload, true);
}

export async function updateHotel(id: string, payload: UpdateHotelRequest): Promise<Hotel> {
  return apiPut<Hotel, UpdateHotelRequest>(`/api/hotels/${id}`, payload, true);
}

export async function deleteHotel(id: string): Promise<void> {
  return apiDelete(`/api/hotels/${id}`, true);
}
