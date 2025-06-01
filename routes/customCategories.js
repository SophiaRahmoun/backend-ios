const express = require("express");
const router = express.Router();
const CustomCategory = require("../models/CustomCategory");

router.get("/:userId", async (req, res) => {
  const categories = await CustomCategory.find({ userId: req.params.userId });
  res.json(categories);
});

router.post("/", async (req, res) => {
  const newCategory = new CustomCategory(req.body);
  await newCategory.save();
  res.status(201).json(newCategory);
});

router.delete("/:id", async (req, res) => {
  await CustomCategory.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;