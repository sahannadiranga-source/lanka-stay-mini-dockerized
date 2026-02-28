# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/HotelBooking.sln backend/HotelBooking.sln
COPY backend/src/HotelBooking.Api/ backend/src/HotelBooking.Api/

WORKDIR /src/backend/src/HotelBooking.Api
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "HotelBooking.Api.dll"]