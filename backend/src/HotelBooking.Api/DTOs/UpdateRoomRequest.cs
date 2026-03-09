namespace HotelBooking.Api.DTOs;

public record UpdateRoomRequest(Guid HotelId, string Name, string Type, decimal PricePerNight, int Capacity);
