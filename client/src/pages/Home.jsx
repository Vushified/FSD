import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { getEvents } from "../services/api";

const defaultEvents = [
  {
    _id: "1",
    id: 1,
    title: "Tech Fest 2026",
    description: "A technology event for students.",
    date: "2026-11-15",
    time: "10:00",
    location: "Mumbai",
    category: "Technology",
  },
  {
    _id: "2",
    id: 2,
    title: "React Workshop",
    description: "Learn React from basics to advanced.",
    date: "2026-11-20",
    time: "14:00",
    location: "Pune",
    category: "Workshop",
  },
  {
    _id: "3",
    id: 3,
    title: "AI Conference",
    description: "Explore the latest developments in AI.",
    date: "2026-11-25",
    time: "09:30",
    location: "Bengaluru",
    category: "Conference",
  },
];

function Home() {
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    getEvents()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data.slice(0, 3));
        } else {
          setEvents(defaultEvents);
        }
      })
      .catch(() => {
        setEvents(defaultEvents);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-100 px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 md:text-6xl">
          Discover Amazing Events
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Find exciting events, connect with people, and register for
          experiences that interest you.
        </p>
        <Link
          to="/events"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Explore Events
        </Link>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Find Your Next Experience
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Explore technology workshops, conferences, festivals, and other
          exciting events happening near you.
        </p>
      </section>

      {/* Upcoming Events Preview */}
      {events.length > 0 && (
        <section className="bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Upcoming Events
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  id={event._id || event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  category={event.category}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
