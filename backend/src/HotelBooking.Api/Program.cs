using HotelBooking.Api.Data;
using HotelBooking.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using HotelBooking.Api.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("Default");
    opt.UseNpgsql(cs);
});

// allow React dev server
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("frontend");

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/hotels", async (AppDbContext db) =>
{
    var hotels = await db.Hotels
        .OrderBy(h => h.Name)
        .Select(h => new HotelDto(h.Id, h.Name, h.Location, h.Description))
        .ToListAsync();

    return Results.Ok(hotels);
});

app.MapGet("/api/hotels/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var hotel = await db.Hotels
        .Where(h => h.Id == id)
        .Select(h => new HotelDetailsDto(
            h.Id,
            h.Name,
            h.Location,
            h.Description,
            h.Rooms.Select(r => new RoomDto(
                r.Id, r.HotelId, r.Name, r.Type, r.PricePerNight, r.Capacity
            )).ToList()
        ))
        .FirstOrDefaultAsync();

    return hotel is null ? Results.NotFound() : Results.Ok(hotel);
});

app.MapGet("/api/hotels/{id:guid}/rooms", async (Guid id, AppDbContext db) =>
{
    var rooms = await db.Rooms
        .Where(r => r.HotelId == id)
        .OrderBy(r => r.Name)
        .Select(r => new RoomDto(r.Id, r.HotelId, r.Name, r.Type, r.PricePerNight, r.Capacity))
        .ToListAsync();

    return Results.Ok(rooms);
});

app.MapGet("/api/bookings", async (HttpRequest req, Guid? hotelId, AppDbContext db, IConfiguration cfg) =>
{
    if (!AdminAuth.IsAdmin(req, cfg))
        return Results.Unauthorized();

    var q = db.Bookings.AsQueryable();

    if (hotelId.HasValue && hotelId.Value != Guid.Empty)
    {
        q = q.Where(b => db.Rooms.Any(r => r.Id == b.RoomId && r.HotelId == hotelId.Value));
    }

    var list = await q
        .OrderByDescending(b => b.CreatedAt)
        .Select(b => new BookingDto(
            b.Id, b.RoomId, b.GuestName, b.Email, b.Phone,
            b.CheckIn, b.CheckOut, b.TotalPrice, b.Status, b.CreatedAt
        ))
        .ToListAsync();

    return Results.Ok(list);
});

app.MapControllers();

app.MapPost("/api/bookings", async (CreateBookingRequest req, AppDbContext db) =>
{
    // Basic validation
    if (req.RoomId == Guid.Empty) return Results.BadRequest("RoomId is required.");
    if (string.IsNullOrWhiteSpace(req.GuestName)) return Results.BadRequest("GuestName is required.");
    if (string.IsNullOrWhiteSpace(req.Email)) return Results.BadRequest("Email is required.");
    if (req.CheckOut <= req.CheckIn) return Results.BadRequest("CheckOut must be after CheckIn.");

    var room = await db.Rooms.FirstOrDefaultAsync(r => r.Id == req.RoomId);
    if (room is null) return Results.NotFound("Room not found.");

    // Overlap rule:
    // Overlap exists if: (existing.CheckIn < new.CheckOut) AND (new.CheckIn < existing.CheckOut)
    // Consider only CONFIRMED bookings.
    var overlap = await db.Bookings.AnyAsync(b =>
        b.RoomId == req.RoomId &&
        b.Status == "CONFIRMED" &&
        b.CheckIn < req.CheckOut &&
        req.CheckIn < b.CheckOut
    );

    if (overlap)
        return Results.Conflict("Room is not available for the selected dates.");

    var nights = req.CheckOut.DayNumber - req.CheckIn.DayNumber;
    var total = nights * room.PricePerNight;

    var booking = new HotelBooking.Api.Models.Booking
    {
        RoomId = req.RoomId,
        GuestName = req.GuestName.Trim(),
        Email = req.Email.Trim(),
        Phone = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim(),
        CheckIn = req.CheckIn,
        CheckOut = req.CheckOut,
        TotalPrice = total,
        Status = "CONFIRMED",
        CreatedAt = DateTime.UtcNow
    };

    db.Bookings.Add(booking);
    await db.SaveChangesAsync();

    var dto = new BookingDto(
        booking.Id,
        booking.RoomId,
        booking.GuestName,
        booking.Email,
        booking.Phone,
        booking.CheckIn,
        booking.CheckOut,
        booking.TotalPrice,
        booking.Status,
        booking.CreatedAt
    );

    return Results.Created($"/api/bookings/{booking.Id}", dto);
});

// Seed (runs on startup)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.SeedAsync(db);
}

app.Run();