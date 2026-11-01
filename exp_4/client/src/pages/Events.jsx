import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import { getEvents } from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Upcoming Events
        </h1>
        <p className="mt-2 text-slate-600">
          Explore our upcoming events and register.
        </p>

        {loading && <Loading />}

        {!loading && error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="mt-6 text-slate-600">
            No events are available.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                time={event.time}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
