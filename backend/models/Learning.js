const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
  {
    module:   { type: String, required: true },   // e.g. "earthquake"
    category: { type: String, required: true },
    title:    { type: String, required: true },
    content:  { type: String, required: true },   // rich text / markdown
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Learning", learningSchema);