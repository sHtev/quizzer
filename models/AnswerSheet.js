import mongoose from "mongoose";

const RoundAnswersSchema = new mongoose.Schema({
  roundID: String,
  roundTotal: Number,
  answers: [String],
});

const AnswerSheetSchema = new mongoose.Schema({
  currentTotal: Number,
  rounds: [RoundAnswersSchema],
});

const AnswerSheet = mongoose.model("AnswerSheet", AnswerSheetSchema);

export default AnswerSheet;
