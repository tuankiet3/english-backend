const express = require("express");
const router = express.Router();

const Topic = require("../models/topic");
const Vocabulary = require("../models/vocabulary");
const topic = require("../models/topic");

// topic routes
// GET: get all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await topic.find().sort({ createdAt: -1 });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching topics", error });
  }
});

// POST: create a new topic
router.post("/topics", async (req, res) => {
  const topic = new Topic({
    name: req.body.name,
  });
  try {
    const newTopic = await topic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: "Error creating topic", error });
  }
});

// vocabulary routes
// GET: get all vocabulary for a topic
router.get("/topics/:topicId/voecabulary", async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find({
      topic: req.params.topicId,
    });
    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vocabulary", error });
  }
});

// POST: create a new vocabulary for a topic
router.post("/topics/:topicId/vocabulary", async (req, res) => {
  const vocabulary = new Vocabulary({
    englishWord: req.body.englishWord,
    vietnameseMeaning: req.body.vietnameseMeaning,
    exampleSentence: req.body.exampleSentence,
    topic: req.params.topicId,
  });
  try {
    const newVocabulary = await vocabulary.save();
    res.status(201).json(newVocabulary);
  } catch (error) {
    res.status(400).json({ message: "Error creating vocabulary", error });
  }
});

module.exports = router;
