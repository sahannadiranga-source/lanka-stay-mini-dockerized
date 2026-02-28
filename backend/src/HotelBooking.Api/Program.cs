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

app.MapControllers();

// Seed (runs on startup)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.SeedAsync(db);
}

app.Run();