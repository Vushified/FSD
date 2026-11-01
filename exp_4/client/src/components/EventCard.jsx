import { useState } from "react";

function EventCard({
  title,
  description,
  date,
  time,
  location,
}) {
  const [registered, setRegistered] = useState(false);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-slate-600">
        {description}
      </p>
      <p className="mt-3 text-slate-600">
        Date: {date}
      </p>
      <p className="text-slate-600">
        Time: {time}
      </p>
      <p className="text-slate-600">
        Location: {location}
      </p>

      {registered ? (
        <p className="mt-4 font-semibold text-green-600">
          Successfully Registered!
        </p>
      ) : (
        <button
          onClick={() => setRegistered(true)}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Register
        </button>
      )}
    </div>
  );
}

export default EventCard;
