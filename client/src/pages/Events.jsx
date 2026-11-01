import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import { getEvents, getMyRegistrations } from "../services/api";
import useAuth from "../hooks/useAuth";

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

function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state (Page 131 requirements & Experiment 3)
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    async function loadEventsData() {
      try {
        setLoading(true);
        const data = await getEvents();

        // 2 second delay to clearly demonstrate and screenshot the loading spinner (PDF page 58)
        setTimeout(async () => {
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          } else {
            setEvents(defaultEvents);
          }

          // If user is logged in, load user registrations to mark already registered cards
          if (user) {
            try {
              const userRegistrations = await getMyRegistrations();
              const registeredIds = new Set(
                userRegistrations.map((reg) =>
                  reg.event ? (reg.event._id || reg.event.id) : null
                ).filter(Boolean)
              );
              setRegisteredEventIds(registeredIds);
            } catch {
              // Non-blocking
            }
          }

          setLoading(false);
        }, 2500);
      } catch (err) {
        setTimeout(() => {
          setEvents(defaultEvents);
          setLoading(false);
        }, 2500);
      }
    }

    loadEventsData();
  }, [user]);

  // Handle successful registration callback
  const handleRegisterSuccess = (eventId) => {
    setRegisteredEventIds((prev) => new Set([...prev, eventId]));
  };

  // Filter events based on search title, category, location, and date
  const filteredEvents = events.filter((event) => {
    const matchesTitle = searchTitle.trim() === "" ||
      event.title.toLowerCase().includes(searchTitle.toLowerCase().trim());

    const matchesCategory = filterCategory === "All" ||
      (event.category && event.category.toLowerCase() === filterCategory.toLowerCase());

    const matchesLocation = filterLocation.trim() === "" ||
      (event.location && event.location.toLowerCase().includes(filterLocation.toLowerCase().trim()));

    const matchesDate = !filterDate || (() => {
      if (!event.date) return false;
      const eventDateStr = new Date(event.date).toISOString().split("T")[0];
      return eventDateStr === filterDate;
    })();

    return matchesTitle && matchesCategory && matchesLocation && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Upcoming Events
        </h1>
        <p className="mt-2 text-slate-600">
          Explore our upcoming events and register.
        </p>

        {/* Search and Filter Section (Page 131 & Experiment 3) */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search by Event Title */}
            <div>
              <label
                htmlFor="search-title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Search Events
              </label>
              <input
                id="search-title"
                type="text"
                placeholder="Search by event title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter by Category */}
            <div>
              <label
                htmlFor="filter-category"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Filter by Category
              </label>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Filter by Location */}
            <div>
              <label
                htmlFor="filter-location"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Filter by Location
              </label>
              <input
                id="filter-location"
                type="text"
                placeholder="e.g. Mumbai, Pune..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter by Date */}
            <div>
              <label
                htmlFor="filter-date"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Filter by Date
              </label>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {(searchTitle || filterCategory !== "All" || filterLocation || filterDate) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTitle("");
                  setFilterCategory("All");
                  setFilterLocation("");
                  setFilterDate("");
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {loading && <Loading />}

        {!loading && error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <p className="mt-6 text-slate-600">
            No events are available.
          </p>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const eventId = event._id || event.id;
              const isRegistered = registeredEventIds.has(eventId);

              return (
                <EventCard
                  key={eventId}
                  id={eventId}
                  _id={eventId}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  category={event.category}
                  isRegistered={isRegistered}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
