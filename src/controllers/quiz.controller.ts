import { Request, Response, NextFunction } from "express";
import { Quiz } from "../models/quiz.model";

export const getAllQuizzes = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, options, correctAnswer, course, topic, dueDate } =
      req.body;
    const quiz = new Quiz({
      question,
      options,
      correctAnswer,
      course,
      topic,
      dueDate,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await Quiz.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
