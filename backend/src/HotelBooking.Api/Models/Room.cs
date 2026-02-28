namespace HotelBooking.Api.Models;

public class Room
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HotelId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Standard";
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }

    public Hotel? Hotel { get; set; }
    public List<Booking> Bookings { get; set; } = new();
}