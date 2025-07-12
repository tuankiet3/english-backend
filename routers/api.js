const express = require("express");
const router = express.Router();

const Topic = require("../models/Topic"); // Sửa lại tên biến cho nhất quán
const Vocabulary = require("../models/Vocabulary"); // Sửa lại tên biến cho nhất quán

// topic routes
// GET: get all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 }); // Sử dụng biến Topic đã require ở trên
    res.json(topics); // <--- THÊM DÒNG NÀY
  } catch (error) {
    return res.status(500).json({ message: "Error fetching topics", error });
  }
});

// POST: create a new topic
router.post("/topics", async (req, res) => {
  // check if topic name is existing
  const existingTopic = await Topic.findOne({ name: req.body.name });
  if (existingTopic) {
    return res.status(400).json({ message: "Topic already exists" });
  }
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
// SỬA LẠI "voecabulary" -> "vocabulary"
router.get("/topics/:topicId/vocabulary", async (req, res) => {
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
  //  check if vocabulary already exists
  const existingVocabulary = await Vocabulary.findOne({
    englishWord: req.body.englishWord,
    topic: req.params.topicId,
  });

  if (existingVocabulary) {
    return res.status(400).json({ message: "Vocabulary already exists" });
  }

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

// DELETE: delete a vocabulary by ID
router.delete("/vocabulary/:id", async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }
    res.status(200).json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vocabulary", error });
  }
});

// PUT: update a vocabulary by ID
router.put("/vocabulary/:id", async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      {
        englishWord: req.body.englishWord,
        vietnameseMeaning: req.body.vietnameseMeaning,
        exampleSentence: req.body.exampleSentence,
      },
      { new: true }
    );
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }
    res.status(200).json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: "Error updating vocabulary", error });
  }
});

// find a vocabulary by vietnamese meaning
router.get("/vocabulary/search", async (req, res) => {
  const vietnameseMeaning = req.query.meaning;
  if (!vietnameseMeaning) {
    return res.status(400).json({ message: "Vietnamese meaning is required" });
  }

  try {
    const vocabulary = await Vocabulary.findOne({
      vietnameseMeaning: new RegExp(vietnameseMeaning, "i"),
    });
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: "Error searching vocabulary", error });
  }
});

module.exports = router;
