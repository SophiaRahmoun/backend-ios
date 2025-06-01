const mongoose = require("mongoose");

const customCategorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model("CustomCategory", customCategorySchema);