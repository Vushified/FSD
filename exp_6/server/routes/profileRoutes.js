const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

/**
 * GET /api/profiles/:id
 * 
 * Demonstrates Broken Access Control (IDOR) and its remediation:
 * - Vulnerable mode (Default): Fetches user by :id without verifying ownership.
 *   Any authenticated user can read any other user's private profile.
 * - Secure mode (FIX_IDOR=true or ?fixed=true): Enforces ownership check (req.user._id === req.params.id).
 *   Rejects unauthorized access with 403 Forbidden.
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const requestedId = req.params.id;

    // Check if IDOR mitigation is active (via query param ?fixed=true or env var FIX_IDOR=true)
    const isMitigated =
      process.env.FIX_IDOR === "true" || req.query.fixed === "true";

    // --- STEP 7: OWNERSHIP CHECK TO PREVENT IDOR ---
    if (isMitigated) {
      if (req.user._id.toString() !== requestedId) {
        return res.status(403).json({
          status: "fail",
          error: "Forbidden",
          message: "Access denied: You are not authorized to view another user's profile.",
        });
      }
    }
    // -----------------------------------------------

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

