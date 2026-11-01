require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Event = require("../models/Event");

async function seed() {
  await connectDB();

  // Seed Admin & User
  const adminExists = await User.findOne({ email: "admin@eventhub.com" });
  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash("adminpassword123", 12);
    await User.create({
      name: "Admin User",
      email: "admin@eventhub.com",
      password: hashedAdminPassword,
      role: "admin",
    });
    console.log("Admin account created: admin@eventhub.com / adminpassword123");
  }

  const userExists = await User.findOne({ email: "user@eventhub.com" });
  if (!userExists) {
    const hashedUserPassword = await bcrypt.hash("userpassword123", 12);
    await User.create({
      name: "Vidushi Singh",
      email: "user@eventhub.com",
      password: hashedUserPassword,
      role: "user",
    });
    console.log("User account created: user@eventhub.com / userpassword123");
  }

  // Seed Events if empty
  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.create([
      {
        title: "Tech Fest 2026",
        description: "A technology event for students.",
        date: new Date("2026-11-15"),
        time: "10:00",
        location: "Mumbai",
        category: "Technology",
      },
      {
        title: "React Workshop",
        description: "Learn React from basics to advanced.",
        date: new Date("2026-11-20"),
        time: "14:00",
        location: "Pune",
        category: "Workshop",
      },
      {
        title: "AI Conference",
        description: "Explore the latest developments in AI.",
        date: new Date("2026-11-25"),
        time: "09:30",
        location: "Bengaluru",
        category: "Conference",
      },
    ]);
    console.log("Initial events seeded into MongoDB!");
  }

  console.log("Database seed completed successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
