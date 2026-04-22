const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use("/api/modules",  require("./routes/modules"));
app.use("/api/scores",   require("./routes/scores"));
app.use("/api/drills",   require("./routes/drills"));
app.use("/api/learning", require("./routes/learning"));
app.use("/api/auth",     require("./routes/auth"));

app.get("/", (req, res) => res.json({ message: "Backend running" }));

// ── DB + Start ──────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });