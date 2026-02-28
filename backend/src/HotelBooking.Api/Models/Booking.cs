namespace HotelBooking.Api.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RoomId { get; set; }

    public string GuestName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }

    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }

    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "CONFIRMED";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Room? Room { get; set; }
}