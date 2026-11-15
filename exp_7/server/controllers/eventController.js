const mongoose = require("mongoose");
const Event = require("../models/Event");

// GET /api/events
// Retrieve all events
async function getEvents(req, res) {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error.message);

    res.status(500).json({
      message: "Failed to retrieve events",
    });
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
    const { title, description, date, time, location } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
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
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("event:created", {
        message: `A new event has been added: ${event.title}`,
        event: {
          _id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
        },
        createdAt: new Date(),
      });
    }

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

    const { title, description, date, time, location } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
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

    const io = req.app.get("io");
    if (io) {
      io.emit("event:updated", {
        message: `An event has been updated: ${event.title}`,
        event: {
          _id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
        },
        createdAt: new Date(),
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

    const io = req.app.get("io");
    if (io) {
      io.emit("event:deleted", {
        message: `An event has been cancelled: ${event.title}`,
        event: {
          _id: event._id,
          title: event.title,
        },
        createdAt: new Date(),
      });
    }

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
