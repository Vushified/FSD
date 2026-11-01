let events = [
  {
    id: 1,
    title: "Tech Fest 2026",
    description: "A technology event for students.",
    date: "2026-11-15",
    time: "10:00",
    location: "Mumbai",
  },
  {
    id: 2,
    title: "React Workshop",
    description: "Learn React from basics to advanced.",
    date: "2026-11-20",
    time: "14:00",
    location: "Pune",
  },
  {
    id: 3,
    title: "AI Conference",
    description: "Explore the latest developments in AI.",
    date: "2026-11-25",
    time: "09:30",
    location: "Bengaluru",
  },
];

// GET /api/events
function getEvents(req, res) {
  res.status(200).json(events);
}

// GET /api/events/:id
function getEventById(req, res) {
  const id = Number(req.params.id);

  const event = events.find((event) => event.id === id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.status(200).json(event);
}

// POST /api/events
function createEvent(req, res) {
  const { title, description, date, time, location } = req.body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !date?.trim() ||
    !time?.trim() ||
    !location?.trim()
  ) {
    return res.status(400).json({
      message: "All event fields are required",
    });
  }

  const newEvent = {
    id: events.length
      ? Math.max(...events.map((event) => event.id)) + 1
      : 1,
    title: title.trim(),
    description: description.trim(),
    date: date.trim(),
    time: time.trim(),
    location: location.trim(),
  };

  events.push(newEvent);

  res.status(201).json({
    message: "Event created successfully",
    event: newEvent,
  });
}

// PUT /api/events/:id
function updateEvent(req, res) {
  const id = Number(req.params.id);

  const index = events.findIndex((event) => event.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const { title, description, date, time, location } = req.body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !date?.trim() ||
    !time?.trim() ||
    !location?.trim()
  ) {
    return res.status(400).json({
      message: "All event fields are required",
    });
  }

  events[index] = {
    id,
    title: title.trim(),
    description: description.trim(),
    date: date.trim(),
    time: time.trim(),
    location: location.trim(),
  };

  res.status(200).json({
    message: "Event updated successfully",
    event: events[index],
  });
}

// DELETE /api/events/:id
function deleteEvent(req, res) {
  const id = Number(req.params.id);

  const index = events.findIndex((event) => event.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const deletedEvent = events[index];

  events = events.filter((event) => event.id !== id);

  res.status(200).json({
    message: "Event deleted successfully",
    event: deletedEvent,
  });
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
