using HotelBooking.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Api.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Hotels.AnyAsync()) return;

        var h1 = new Hotel { Name = "Ocean View Hotel", Location = "Galle", Description = "Near the beach" };
        var h2 = new Hotel { Name = "City Stay", Location = "Colombo", Description = "Central location" };
        var h3 = new Hotel { Name = "Hilltop Resort", Location = "Nuwara Eliya", Description = "Cool climate views" };

        db.Hotels.AddRange(h1, h2, h3);
        await db.SaveChangesAsync();

        db.Rooms.AddRange(
            new Room { HotelId = h1.Id, Name = "101", Type = "Deluxe", PricePerNight = 18000, Capacity = 2 },
            new Room { HotelId = h1.Id, Name = "102", Type = "Standard", PricePerNight = 12000, Capacity = 2 },
            new Room { HotelId = h2.Id, Name = "201", Type = "Suite", PricePerNight = 25000, Capacity = 3 },
            new Room { HotelId = h2.Id, Name = "202", Type = "Standard", PricePerNight = 14000, Capacity = 2 },
            new Room { HotelId = h3.Id, Name = "301", Type = "Deluxe", PricePerNight = 20000, Capacity = 2 }
        );

        await db.SaveChangesAsync();
    }
}