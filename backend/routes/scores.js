const express = require("express");
const router  = express.Router();
const Score   = require("../models/Score");
const auth    = require("../middleware/auth");

// POST /api/scores  — save score (must be logged in)
router.post("/", auth, async (req, res) => {
  try {
    const { module, score } = req.body;
    const username = req.user.username;

    // Upsert — one score per user per module (keeps best or latest)
    const entry = await Score.findOneAndUpdate(
      { username, module },
      { username, module, score },
      { upsert: true, new: true }
    );
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/scores  — all scores (admin)
router.get("/", auth, async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/me  — current user's scores
router.get("/me", auth, async (req, res) => {
  try {
    const scores = await Score.find({ username: req.user.username });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/:username  — specific user (admin)
router.get("/:username", auth, async (req, res) => {
  try {
    const scores = await Score.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;