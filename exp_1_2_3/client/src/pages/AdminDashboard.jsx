import { useState, useEffect } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} from "../services/api";
import Loading from "../components/Loading";

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

function AdminDashboard() {
  const [events, setEvents] = useState(defaultEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "10:00",
    location: "",
    category: "Technology",
  });

  async function loadEventsData() {
    try {
      setLoading(true);
      setError("");
      const data = await getEvents();
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(defaultEvents);
      }
    } catch (err) {
      setError(err.message || "Failed to load events");
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventsData();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date ||
      !formData.time.trim() ||
      !formData.location.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        await updateEvent(editingId, formData);
      } else {
        await createEvent(formData);
      }

      await loadEventsData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "10:00",
        location: "",
        category: "Technology",
      });
    } catch (err) {
      setFormError(err.message || "Operation failed.");
    }
  }

  function handleEdit(event) {
    const id = event._id || event.id;
    setEditingId(id);

    // format date for input field
    const dateStr = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : "";

    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: dateStr,
      time: event.time || "10:00",
      location: event.location || "",
      category: event.category || "Technology",
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => (ev._id || ev.id) !== id));
      if (selectedEventAttendees?.id === id) {
        setSelectedEventAttendees(null);
      }
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  }

  async function handleViewRegistrations(event) {
    const id = event._id || event.id;
    setAttendeesLoading(true);
    try {
      const attendees = await getEventRegistrations(id);
      setSelectedEventAttendees({
        id,
        title: event.title,
        attendees: attendees || [],
      });
    } catch (err) {
      alert(err.message || "Failed to load attendees");
    } finally {
      setAttendeesLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage events and view registrations.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                description: "",
                date: "",
                time: "10:00",
                location: "",
                category: "Technology",
              });
              setFormError("");
              setShowForm(!showForm);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            {showForm ? "Close Form" : "Create Event"}
          </button>
        </div>

        {/* Create / Edit Event Form */}
        {showForm && (
          <div className="mt-8 rounded-xl border bg-white p-6 shadow-md max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {editingId ? "Update Event" : "Create New Event"}
            </h2>

            {formError && (
              <p className="mb-4 text-sm font-semibold text-red-600">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. React Conference 2026"
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event details..."
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="text"
                    name="time"
                    required
                    placeholder="e.g. 10:00"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Mumbai"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Save Changes" : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* View Attendees / Registrations Section */}
        {selectedEventAttendees && (
          <div className="mt-8 rounded-xl border bg-white p-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="text-xl font-bold text-slate-900">
                Registrations for {selectedEventAttendees.title}
              </h3>
              <button
                onClick={() => setSelectedEventAttendees(null)}
                className="text-slate-500 hover:text-slate-700 font-bold"
              >
                ✕ Close
              </button>
            </div>
            {attendeesLoading ? (
              <Loading />
            ) : selectedEventAttendees.attendees.length === 0 ? (
              <p className="mt-4 text-slate-500">No attendees have registered yet.</p>
            ) : (
              <ul className="mt-4 divide-y">
                {selectedEventAttendees.attendees.map((a, i) => (
                  <li key={i} className="py-3 text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-semibold">{a.user?.name || "Attendee"}</span>
                      <span className="ml-2 text-slate-500 text-xs">({a.user?.email || "No email"})</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Registered on: {new Date(a.createdAt || a.registrationDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Events Table */}
        {loading && <Loading />}

        {!loading && error && (
          <p className="mt-6 text-red-600">{error}</p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="mt-6 text-slate-600">No events found in database.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {events.map((event) => {
                  const id = event._id || event.id;
                  const formattedDate = event.date
                    ? !isNaN(new Date(event.date).getTime())
                      ? new Date(event.date).toLocaleDateString("en-IN", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : event.date
                    : "";

                  return (
                    <tr key={id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4">{formattedDate}</td>
                      <td className="px-6 py-4">{event.time}</td>
                      <td className="px-6 py-4">{event.location}</td>
                      <td className="px-6 py-4">{event.category || "General"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewRegistrations(event)}
                          className="rounded bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Registrations
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="rounded bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
