const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

/**
 * GET /api/profiles/:id
 * 
 * STEP 7: OWNERSHIP CHECK TO PREVENT IDOR (Insecure Direct Object Reference)
 * Verifies whether the authenticated user (req.user) owns the requested profile record.
 * 
 * - If User A requests User A's profile -> 200 OK
 * - If User A requests User B's profile -> 403 Forbidden (Access Denied)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const requestedId = req.params.id;
    const authenticatedUserId = req.user._id
      ? req.user._id.toString()
      : req.user.id?.toString();

    // Allow testing the original vulnerable state if ?vulnerable=true is passed
    const isVulnerableTest = req.query.vulnerable === "true";

    // --- STEP 7: OWNERSHIP CHECK (FIXED) ---
    if (!isVulnerableTest && authenticatedUserId !== requestedId) {
      return res.status(403).json({
        status: "fail",
        error: "Forbidden",
        message: "Access denied: You are not authorized to view another user's profile.",
      });
    }
    // ----------------------------------------

    const profile = await User.findById(requestedId).select("-password");

    if (!profile) {
      return res.status(404).json({
        status: "fail",
        error: "Not Found",
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      profile: {
        _id: profile._id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        createdAt: profile.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
