namespace HotelBooking.Api.DTOs;

public record CreateBookingRequest(
    Guid RoomId,
    string GuestName,
    string Email,
    string? Phone,
    DateOnly CheckIn,
    DateOnly CheckOut
);