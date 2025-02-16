const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const routes = require("./routes"); // Import your routes
const { default: mongoose } = require("mongoose");

dotenv.config(); // Load environment variables

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // Logger for requests

//Database connection
mongoose.connect(process.env.MONGODB_URL)
 .then(() => console.log('MongoDB Connected...'))
 .catch(err => console.log(err));

// Routes
app.use("/api", routes); // Use your routes

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to Express.js Server");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
