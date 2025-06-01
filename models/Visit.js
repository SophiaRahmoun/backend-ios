const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  category: String,
  startTime: Date,
  endTime: Date,
  duration: Number 
});

module.exports = mongoose.model("Visit", visitSchema);