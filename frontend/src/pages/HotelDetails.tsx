import { Link, useParams } from "react-router-dom";

export default function HotelDetails() {
  const { id } = useParams();

  return (
    <div>
      <Link to="/">← Back</Link>
      <h2>Hotel Details</h2>
      <p>Hotel ID: <b>{id}</b></p>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p>Placeholder UI for hotel details + rooms.</p>
        <p>Next step: show rooms + booking form.</p>
      </div>
    </div>
  );
}