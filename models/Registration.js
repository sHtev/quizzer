import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  registrationCode: {
    type: String,
    required: true,
    unique: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  teamName: {
    type: String,
    trim: true,
  },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

export default Registration;
