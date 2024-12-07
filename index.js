const mongoose = require("mongoose");
const express = require("express");
const PORT = 8000;
const cors = require('cors');
require("dotenv").config();

const app = express();

const mongoURI = process.env.MONGO_URI;

// Correct CORS setup
app.use(cors({
  // origin: "http://localhost:3000",  // Use 'http' instead of 'https'
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "application/json"]
}));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(PORT, () => {
      console.log(`Adocal is running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Failed to connect to MongoDB");
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Server connected successfully");
});

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/returns', require('./routes/returns'));

