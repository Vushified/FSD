import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/api";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      if (editingId) {
        await updateEvent(editingId, formData);
        setSuccessMessage("Event updated successfully! Notification sent.");
      } else {
        await createEvent(formData);
        setSuccessMessage("Event created successfully! Notification sent.");
      }
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });
      setEditingId(null);
      loadEvents();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(event) {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.slice(0, 10) : "",
      time: event.time,
      location: event.location,
    });
    setSuccessMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setSuccessMessage("Event deleted successfully! Notification sent.");
      loadEvents();
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-slate-600">
          Create, update, and delete events. Real-time notifications will be broadcast to all connected users.
        </p>

        {successMessage && (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-700 border border-green-200">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Create / Edit Form */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            {editingId ? "Edit Event" : "Create New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. AI & Robotics Conference"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Bangalore Campus"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 10:00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief event description..."
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Event" : "Create Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: "", description: "", date: "", time: "", location: "" });
                  }}
                  className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Events List */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">Existing Events</h2>

          {loading ? (
            <p className="mt-4 text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="mt-4 text-slate-500">No events found.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {events.map((ev) => (
                <div key={ev._id} className="flex flex-col justify-between py-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{ev.title}</h3>
                    <p className="text-sm text-slate-500">
                      {ev.location} • {ev.time} • {new Date(ev.date).toLocaleDateString("en-IN", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(ev)}
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev._id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
