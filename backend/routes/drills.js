const express = require("express");
const router  = express.Router();
const Score   = require("../models/Score");

// POST /api/scores
router.post("/", async (req, res) => {
  try {
    const { username, module, score } = req.body;
    const entry = await Score.create({ username, module, score });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/scores  (admin — all scores)
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/:username  (student dashboard)
router.get("/:username", async (req, res) => {
  try {
    const scores = await Score.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;