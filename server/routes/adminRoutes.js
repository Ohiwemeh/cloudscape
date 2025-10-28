import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

// Note: We create a new router here
const router = express.Router();

// Get all users (admin only)
// This will be mounted at GET /api/admin/users
router.get("/users", protect, async (req, res) => {
  try {
    // Check if the requesting user is an admin
    const requestingUser = await User.findById(req.user._id);
    if (!requestingUser.isAdmin) {
      return res.status(403).json({ message: "Not authorized - admin access only" });
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user stats (admin only)
// This will be mounted at GET /api/admin/stats
router.get("/stats", protect, async (req, res) => {
  try {
    // Check if the requesting user is an admin
    const requestingUser = await User.findById(req.user._id);
    if (!requestingUser.isAdmin) {
      return res.status(403).json({ message: "Not authorized - admin access only" });
    }

    const totalUsers = await User.countDocuments({});
    const recentUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
