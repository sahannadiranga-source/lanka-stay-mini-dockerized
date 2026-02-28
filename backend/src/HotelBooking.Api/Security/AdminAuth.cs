namespace HotelBooking.Api.Security;

public static class AdminAuth
{
    public const string HeaderName = "X-ADMIN-KEY";

    public static bool IsAdmin(HttpRequest req, IConfiguration config)
    {
        var expected = config["AdminKey"];
        if (string.IsNullOrWhiteSpace(expected)) return false;

        if (!req.Headers.TryGetValue(HeaderName, out var provided)) return false;

        return string.Equals(provided.ToString(), expected, StringComparison.Ordinal);
    }
}