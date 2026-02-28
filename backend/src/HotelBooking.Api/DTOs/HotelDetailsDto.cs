namespace HotelBooking.Api.DTOs;

public record HotelDetailsDto(
    Guid Id,
    string Name,
    string Location,
    string? Description,
    List<RoomDto> Rooms
);