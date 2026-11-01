const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/my", protect, getMyRegistrations);
router.get("/all", protect, adminOnly, getAllRegistrations);
router.get("/event/:eventId", protect, adminOnly, getEventRegistrations);
router.post("/:eventId", protect, registerForEvent);
router.delete("/:id", protect, cancelRegistration);

module.exports = router;
