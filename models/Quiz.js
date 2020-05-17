import mongoose from "mongoose";

const Media = Object.freeze({
  Audio: "audio",
  Video: "video",
  Image: "image",
});

CategorySchema = new mongoose.Schema({
  name: String,
  triviaDbCode: String,
  mediaType: {
    type: String,
    enum: Object.values(Media),
  },
});

QuestionSchema = new mongoose.Schema({
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

RoundSchema = new mongoose.Schema({
  title: String,
  roundID: String,
  type: String,
  category: CategorySchema,
  questions: [QuestionSchema],
});

QuizSchema = new mongoose.Schema({
  name: String,
  slug: String,
  rounds: [RoundSchema],
});

Object.assign(CategorySchema.statics, {
  Media,
});

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
