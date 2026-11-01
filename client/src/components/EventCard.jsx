import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { registerForEvent } from "../services/api";

function EventCard({
  id,
  _id,
  title,
  description,
  date,
  time,
  location,
  category,
  isRegistered = false,
  onRegisterSuccess,
}) {
  const eventId = _id || id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(isRegistered);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRegistered(isRegistered);
  }, [isRegistered]);

  async function handleRegister() {
    if (!user) {
      navigate("/login");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      if (eventId) {
        await registerForEvent(eventId);
      }
      setRegistered(true);
      if (onRegisterSuccess) {
        onRegisterSuccess(eventId);
      }
    } catch (err) {
      if (
        err.message &&
        err.message.toLowerCase().includes("already registered")
      ) {
        setRegistered(true);
      } else {
        setErrorMsg(err.message || "Failed to register");
      }
    } finally {
      setLoading(false);
    }
  }

  const formattedDate = date
    ? !isNaN(new Date(date).getTime())
      ? new Date(date).toLocaleDateString("en-IN", {
          timeZone: "UTC",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : date
    : "";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      {category && (
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3">
          {category}
        </span>
      )}
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-slate-600">
        {description}
      </p>
      {formattedDate && (
        <p className="mt-3 text-slate-600">
          Date: {formattedDate}
        </p>
      )}
      {time && (
        <p className="text-slate-600">
          Time: {time}
        </p>
      )}
      {location && (
        <p className="text-slate-600">
          Location: {location}
        </p>
      )}

      {registered ? (
        <p className="mt-4 font-semibold text-green-600">
          Successfully Registered!
        </p>
      ) : (
        <button
          onClick={handleRegister}
          disabled={loading}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      )}

      {errorMsg && (
        <p className="mt-2 text-sm text-red-600">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default EventCard;
