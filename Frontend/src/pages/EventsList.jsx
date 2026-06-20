import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-list">
      <h1>Upcoming Events</h1>
      {events.map((event) => (
        <Link key={event._id} to={`/events/${event._id}`} className="event-card">
          <h2>{event.name}</h2>
          <p>{event.venue}</p>
          <p>{new Date(event.dateTime).toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
}

export default EventsList;