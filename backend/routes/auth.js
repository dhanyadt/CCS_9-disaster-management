const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "disaster_secret_key";

// ── POST /api/auth/register ──────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role)
      return res.status(400).json({ error: "Username, password and role are required" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(409).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ username, password: hashed, role });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ─────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Username and password are required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    if (user.role !== role)
      return res.status(403).json({ error: `This account is not registered as ${role}` });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const auth = require("../middleware/auth");

// PUT /api/auth/update-username
router.put("/update-username", auth, async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername?.trim()) return res.status(400).json({ error: "Username required" });
    const exists = await User.findOne({ username: newUsername });
    if (exists) return res.status(409).json({ error: "Username already taken" });
    await User.findByIdAndUpdate(req.user.id, { username: newUsername });
    res.json({ message: "Username updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/update-password
router.put("/update-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user  = await User.findById(req.user.id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ error: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;