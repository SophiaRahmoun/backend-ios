const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

router.get('/', async (req, res) => {
  const visits = await Visit.find();
  res.json(visits);
});

router.post('/', async (req, res) => {
  const newVisit = new Visit(req.body);
  await newVisit.save();
  res.status(201).json(newVisit);
});

module.exports = router;