const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");


dotenv.config();

// Create Express app
const app = express();

const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task Management API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
