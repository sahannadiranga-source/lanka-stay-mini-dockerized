using HotelBooking.Api.Data;
using HotelBooking.Api.DTOs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// ===== HOTEL CRUD =====
app.MapPost("/api/hotels", async (CreateHotelRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name is required.");
    if (string.IsNullOrWhiteSpace(req.Location)) return Results.BadRequest("Location is required.");

    var hotel = new HotelBooking.Api.Models.Hotel
    {
        Name = req.Name.Trim(),
        Location = req.Location.Trim(),
        Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim()
    };

    db.Hotels.Add(hotel);
    await db.SaveChangesAsync();

    var dto = new HotelDto(hotel.Id, hotel.Name, hotel.Location, hotel.Description);
    return Results.Created($"/api/hotels/{hotel.Id}", dto);
});

app.MapPut("/api/hotels/{id:guid}", async (Guid id, UpdateHotelRequest req, AppDbContext db) =>
{
    var hotel = await db.Hotels.FirstOrDefaultAsync(h => h.Id == id);
    if (hotel is null) return Results.NotFound();

    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name is required.");
    if (string.IsNullOrWhiteSpace(req.Location)) return Results.BadRequest("Location is required.");

    hotel.Name = req.Name.Trim();
    hotel.Location = req.Location.Trim();
    hotel.Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim();

    await db.SaveChangesAsync();

    var dto = new HotelDto(hotel.Id, hotel.Name, hotel.Location, hotel.Description);
    return Results.Ok(dto);
});

app.MapDelete("/api/hotels/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var hotel = await db.Hotels.FirstOrDefaultAsync(h => h.Id == id);
    if (hotel is null) return Results.NotFound();

    db.Hotels.Remove(hotel);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

// ===== ROOM CRUD =====
app.MapPost("/api/rooms", async (CreateRoomRequest req, AppDbContext db) =>
{
    if (req.HotelId == Guid.Empty) return Results.BadRequest("HotelId is required.");
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name is required.");
    if (string.IsNullOrWhiteSpace(req.Type)) return Results.BadRequest("Type is required.");
    if (req.PricePerNight <= 0) return Results.BadRequest("PricePerNight must be > 0.");
    if (req.Capacity <= 0) return Results.BadRequest("Capacity must be > 0.");

    var hotelExists = await db.Hotels.AnyAsync(h => h.Id == req.HotelId);
    if (!hotelExists) return Results.BadRequest("Hotel not found.");

    var room = new HotelBooking.Api.Models.Room
    {
        HotelId = req.HotelId,
        Name = req.Name.Trim(),
        Type = req.Type.Trim(),
        PricePerNight = req.PricePerNight,
        Capacity = req.Capacity
    };

    db.Rooms.Add(room);
    await db.SaveChangesAsync();

    var dto = new RoomDto(room.Id, room.HotelId, room.Name, room.Type, room.PricePerNight, room.Capacity);
    return Results.Created($"/api/rooms/{room.Id}", dto);
});

app.MapPut("/api/rooms/{id:guid}", async (Guid id, UpdateRoomRequest req, AppDbContext db) =>
{
    var room = await db.Rooms.FirstOrDefaultAsync(r => r.Id == id);
    if (room is null) return Results.NotFound();

    if (req.HotelId == Guid.Empty) return Results.BadRequest("HotelId is required.");
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name is required.");
    if (string.IsNullOrWhiteSpace(req.Type)) return Results.BadRequest("Type is required.");
    if (req.PricePerNight <= 0) return Results.BadRequest("PricePerNight must be > 0.");
    if (req.Capacity <= 0) return Results.BadRequest("Capacity must be > 0.");

    var hotelExists = await db.Hotels.AnyAsync(h => h.Id == req.HotelId);
    if (!hotelExists) return Results.BadRequest("Hotel not found.");

    room.HotelId = req.HotelId;
    room.Name = req.Name.Trim();
    room.Type = req.Type.Trim();
    room.PricePerNight = req.PricePerNight;
    room.Capacity = req.Capacity;

    await db.SaveChangesAsync();

    var dto = new RoomDto(room.Id, room.HotelId, room.Name, room.Type, room.PricePerNight, room.Capacity);
    return Results.Ok(dto);
});

app.MapDelete("/api/rooms/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var room = await db.Rooms.FirstOrDefaultAsync(r => r.Id == id);
    if (room is null) return Results.NotFound();

    db.Rooms.Remove(room);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapGet("/api/bookings", async (Guid? hotelId, AppDbContext db) =>
{
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