const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VocabularySchema = new Schema({
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  englishWord: {
    type: String,
    required: true,
  },
  vietnameseMeaning: {
    type: String,
    required: true,
  },
  exampleSentence: {
    type: String,
  },
});

module.exports = mongoose.model("Vocabulary", VocabularySchema);
