// Load environment variables FIRST
require("dotenv").config();

// Log environment variables to debug
console.log('[Server] Environment variables loaded');
console.log('[Server] JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('[Server] JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);
console.log('[Server] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

const express = require("express");
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
require("./config/database");
const cors = require("cors");


if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET variable in .env missing.");
  process.exit(-1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error("Error: JWT_REFRESH_SECRET variable in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// User Routes
app.use('/api/users', userRoutes);
// AI Routes
app.use('/api/ai', aiRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});