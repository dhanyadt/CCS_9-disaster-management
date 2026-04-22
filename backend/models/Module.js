const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    category: { type: String, required: true },
    active:   { type: Boolean, default: true },
    students: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);