const express = require("express");
const cors = require("cors");
const app = express();
const eventRoutes = require("./routes/eventRoutes");

// Middleware to read JSON request bodies
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Event Management API Running");
});

// Event API routes
app.use("/api/events", eventRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
