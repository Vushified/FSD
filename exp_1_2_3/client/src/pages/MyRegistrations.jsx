import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getMyRegistrations, cancelRegistration } from "../services/api";
import Loading from "../components/Loading";

function MyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function loadRegistrations() {
    try {
      setLoading(true);
      const data = await getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(err.message || "Unable to load registrations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, [user]);

  async function handleCancel(registrationId) {
    if (!confirm("Are you sure you want to cancel this registration?")) return;

    try {
      setCancellingId(registrationId);
      await cancelRegistration(registrationId);
      setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
    } catch (err) {
      alert(err.message || "Failed to cancel registration");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          My Registrations
        </h1>

        {user ? (
          <p className="mt-4 text-slate-600">
            Welcome,{" "}
            <span className="font-semibold">
              {user.name}
            </span>
            . Your registered events will appear here.
          </p>
        ) : (
          <p className="mt-4 text-red-600">
            Please login to view your registrations.
          </p>
        )}

        {loading && <Loading />}

        {!loading && error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && registrations.length === 0 && (
          <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              You have not registered for any events yet.
            </p>
            <Link
              to="/events"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!loading && !error && registrations.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registrations.map((reg) => {
              const event = reg.event || {};
              const formattedDate = event.date
                ? !isNaN(new Date(event.date).getTime())
                  ? new Date(event.date).toLocaleDateString("en-IN", {
                      timeZone: "UTC",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : event.date
                : "";

              return (
                <div
                  key={reg._id}
                  className="rounded-xl border bg-white p-6 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Confirmed
                    </span>
                    <h2 className="mt-3 text-xl font-bold text-slate-900">
                      {event.title || "Event Title"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {event.description}
                    </p>
                    {formattedDate && (
                      <p className="mt-3 text-sm text-slate-600">
                        📅 Date: {formattedDate}
                      </p>
                    )}
                    {event.time && (
                      <p className="text-sm text-slate-600">
                        ⏰ Time: {event.time}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-slate-600">
                        📍 Location: {event.location}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Registered: {new Date(reg.createdAt || reg.registrationDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleCancel(reg._id)}
                      disabled={cancellingId === reg._id}
                      className="rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {cancellingId === reg._id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRegistrations;
