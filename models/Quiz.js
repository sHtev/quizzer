import mongoose from "mongoose";

const Media = Object.freeze({
  Audio: "audio",
  Video: "video",
  Image: "image",
  Text: "text",
});

const CategorySchema = new mongoose.Schema({
  name: String,
  triviaDbCode: String,
  mediaType: {
    type: String,
    enum: Object.values(Media),
  },
});

const QuestionSchema = new mongoose.Schema({
  description: String,
  mediaLink: String,
  revealMediaLink: String,
  freeText: Boolean,
  correctAnswers: [
    {
      type: String,
    },
  ],
  incorrectAnswers: [
    {
      type: String,
    },
  ],
});

const RoundSchema = new mongoose.Schema({
  title: String,
  roundID: {
    type: String,
    unique: true,
  },
  type: String,
  category: CategorySchema,
  questions: [QuestionSchema],
});

const QuizSchema = new mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
  },
  rounds: [RoundSchema],
});

Object.assign(CategorySchema.statics, {
  Media,
});

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
