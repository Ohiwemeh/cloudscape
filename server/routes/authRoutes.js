import express from "express";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (err) {
    console.warn("Resend init failed:", err.message || err);
    resend = null;
  }
}

// helper: create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// helper: send email via Resend (best-effort)
const sendEmail = async ({ to, subject, html }) => {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "no-reply@cloudscape.example",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Resend email error:", err.message || err);
  }
};

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const adminEmail = 'cloudscape@admin.com';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'cloudadmin123!',
        isAdmin: true
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Call this when the server starts
createAdminUser();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: `Welcome to Cloudscape, ${name}!`,
      html: `<p>Hi ${name},</p><p>Welcome to Cloudscape — we're excited to have you. Your account is ready and you can now shop our collection.</p>`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      // Include isAdmin in response
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
      };

      res.json(userData);

      // login notification (best-effort)
      sendEmail({
        to: email,
        subject: `New sign-in to Cloudscape`,
        html: `<p>Hi ${user.name},</p><p>Your account was just used to sign in. If this wasn't you, please reset your password.</p>`,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET current user
router.get("/me", protect, async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });
  res.json(req.user);
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update password if provided
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    // Send success email
    sendEmail({
      to: user.email,
      subject: "Your Cloudscape profile was updated",
      html: `<p>Hi ${user.name},</p><p>Your account details were just updated. If this wasn't you, please secure your account immediately.</p>`,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
