const express = require("express");
const router  = express.Router();
const Module  = require("../models/Module");

// GET /api/modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find().sort({ createdAt: -1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/modules
router.post("/", async (req, res) => {
  try {
    const { name, category } = req.body;
    const module = await Module.create({ name, category });
    res.status(201).json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/modules/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, category, active } = req.body;
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      { name, category, active },
      { new: true, runValidators: true }
    );
    if (!module) return res.status(404).json({ error: "Module not found" });
    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/modules/:id
router.delete("/:id", async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ error: "Module not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;