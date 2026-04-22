const express  = require("express");
const router   = express.Router();
const Learning = require("../models/Learning");

// GET /api/learning/category/:category
router.get("/category/:category", async (req, res) => {
  try {
    const items = await Learning.find({
      category: { $regex: new RegExp(req.params.category, "i") },
    }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/learning/module/:module
router.get("/module/:module", async (req, res) => {
  try {
    const item = await Learning.findOne({
      module: { $regex: new RegExp(req.params.module, "i") },
    });
    if (!item) return res.status(404).json({ error: "Content not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/learning  (admin)
router.post("/", async (req, res) => {
  try {
    const item = await Learning.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/learning/:id  (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Learning.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;