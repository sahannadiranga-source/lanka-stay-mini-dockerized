import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import AdminHome from "./pages/AdminHome";
import AdminHotels from "./pages/AdminHotels";
import AdminRooms from "./pages/AdminRooms";
import AdminBookings from "./pages/AdminBookings";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/hotels/:id", element: <HotelDetails /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "hotels", element: <AdminHotels /> },
      { path: "rooms", element: <AdminRooms /> },
      { path: "bookings", element: <AdminBookings /> },
    ],
  },
]);