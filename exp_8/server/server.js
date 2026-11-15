require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || "*";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins if wildcard or matching
      if (!origin || allowedOrigin === "*" || allowedOrigin.split(",").map((s) => s.trim()).includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.status(200).send("Event Management API Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
if (registrationRoutes) {
  app.use("/api/registrations", registrationRoutes);
}

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Create one HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

// Make Socket.IO available to Express controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
