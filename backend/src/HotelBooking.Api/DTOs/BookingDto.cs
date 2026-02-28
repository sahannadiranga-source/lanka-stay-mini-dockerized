namespace HotelBooking.Api.DTOs;

public record BookingDto(
    Guid Id,
    Guid RoomId,
    string GuestName,
    string Email,
    string? Phone,
    DateOnly CheckIn,
    DateOnly CheckOut,
    decimal TotalPrice,
    string Status,
    DateTime CreatedAt
);