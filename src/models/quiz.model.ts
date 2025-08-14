import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    course: { type: String, required: true },
    topic: { type: String, required: true },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
