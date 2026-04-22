const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String }],
  answer:   { type: String, required: true },
});

const drillSchema = new mongoose.Schema(
  {
    module:    { type: String, required: true },   // e.g. "earthquake"
    category:  { type: String, required: true },   // e.g. "Natural Disasters"
    title:     { type: String, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drill", drillSchema);