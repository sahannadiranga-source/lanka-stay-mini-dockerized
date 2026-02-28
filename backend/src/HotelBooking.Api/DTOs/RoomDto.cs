namespace HotelBooking.Api.DTOs;

public record RoomDto(
    Guid Id,
    Guid HotelId,
    string Name,
    string Type,
    decimal PricePerNight,
    int Capacity
);