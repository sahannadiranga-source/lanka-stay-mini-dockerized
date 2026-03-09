namespace HotelBooking.Api.DTOs;

public record CreateRoomRequest(Guid HotelId, string Name, string Type, decimal PricePerNight, int Capacity);
