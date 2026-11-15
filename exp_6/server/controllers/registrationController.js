const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// POST /api/registrations/:eventId
// Register logged in user for an event
async function registerForEvent(req, res) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check if user is already registered for this event (prevent duplicate registrations)
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      status: "confirmed",
    });

    const populated = await Registration.findById(registration._id).populate("event");

    res.status(201).json({
      message: "Successfully registered for event",
      registration: populated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }
    console.error("Registration error:", error.message);
    res.status(500).json({
      message: "Failed to register for event",
    });
  }
}

// GET /api/registrations/my
// Get current user's registrations
async function getMyRegistrations(req, res) {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error retrieving user registrations:", error.message);
    res.status(500).json({
      message: "Failed to retrieve your registrations",
    });
  }
}

// GET /api/registrations/all
// Admin: get all registrations
async function getAllRegistrations(req, res) {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email role")
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error retrieving all registrations:", error.message);
    res.status(500).json({
      message: "Failed to retrieve registrations",
    });
  }
}

// GET /api/registrations/event/:eventId
// Admin: get attendees for a specific event
async function getEventRegistrations(req, res) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email role")
      .populate("event", "title date time location")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error retrieving event attendees:", error.message);
    res.status(500).json({
      message: "Failed to retrieve event attendees",
    });
  }
}

// DELETE /api/registrations/:id
// Cancel a registration
async function cancelRegistration(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid registration ID",
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    // Only the registrant or an admin can cancel
    if (
      registration.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied. Cannot cancel another user's registration.",
      });
    }

    await Registration.findByIdAndDelete(id);

    res.status(200).json({
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling registration:", error.message);
    res.status(500).json({
      message: "Failed to cancel registration",
    });
  }
}

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
