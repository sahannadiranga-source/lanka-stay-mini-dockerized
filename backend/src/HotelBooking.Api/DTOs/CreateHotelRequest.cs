namespace HotelBooking.Api.DTOs;

public record CreateHotelRequest(string Name, string Location, string? Description);
