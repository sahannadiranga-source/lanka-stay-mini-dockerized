namespace HotelBooking.Api.DTOs;

public record HotelDto(Guid Id, string Name, string Location, string? Description);