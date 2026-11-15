const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// GET all events
router.get("/", getEvents);

// GET one event
router.get("/:id", getEventById);

// CREATE an event
router.post("/", createEvent);

// UPDATE an event
router.put("/:id", updateEvent);

// DELETE an event
router.delete("/:id", deleteEvent);

module.exports = router;
