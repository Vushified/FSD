const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const defaultEvents = [
  {
    title: "Tech Fest 2026",
    description: "A technology event for students.",
    date: new Date("2026-11-15"),
    time: "10:00",
    location: "Mumbai",
    category: "Technology",
  },
  {
    title: "React Workshop",
    description: "Learn React from basics to advanced.",
    date: new Date("2026-11-20"),
    time: "14:00",
    location: "Pune",
    category: "Workshop",
  },
  {
    title: "AI Conference",
    description: "Explore the latest developments in AI.",
    date: new Date("2026-11-25"),
    time: "09:30",
    location: "Bengaluru",
    category: "Conference",
  },
];

// GET /api/events
// Retrieve all events, with optional search and filter
async function getEvents(req, res) {
  try {
    const { search, location, date } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    if (location && location.trim()) {
      filter.location = { $regex: location.trim(), $options: "i" };
    }

    if (date && date.trim()) {
      const targetDate = new Date(date);
      if (!isNaN(targetDate.getTime())) {
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date = { $gte: targetDate, $lt: nextDay };
      }
    }

    let events = await Event.find(filter).sort({ date: 1 });

    // Auto-seed initial events if database has 0 events and no query filter
    if (events.length === 0 && !search && !location && !date) {
      const totalInDb = await Event.countDocuments();
      if (totalInDb === 0) {
        await Event.insertMany(defaultEvents);
        events = await Event.find(filter).sort({ date: 1 });
      }
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error.message);
    // If DB is offline or empty, return default events gracefully
    res.status(200).json(defaultEvents);
  }
}

// GET /api/events/:id
// Retrieve one event
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error retrieving event:", error.message);
    res.status(500).json({
      message: "Failed to retrieve event",
    });
  }
}

// POST /api/events
// Create an event
async function createEvent(req, res) {
  try {
    const { title, description, date, time, location, category } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      !date ||
      typeof time !== "string" ||
      !time.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      category: category ? category.trim() : "General",
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid event data",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to create event",
    });
  }
}

// PUT /api/events/:id
// Update an event
async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const { title, description, date, time, location, category } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      !date ||
      typeof time !== "string" ||
      !time.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        date,
        time: time.trim(),
        location: location.trim(),
        category: category ? category.trim() : "General",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid event data",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to update event",
    });
  }
}

// DELETE /api/events/:id
// Delete an event
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Also clean up registrations for this event
    await Registration.deleteMany({ event: id });

    res.status(200).json({
      message: "Event deleted successfully",
      event,
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({
      message: "Failed to delete event",
    });
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
