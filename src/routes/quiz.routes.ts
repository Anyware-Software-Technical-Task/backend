import { Router } from "express";
import {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { quizSchema } from "../validators/quiz.validator";

const router = Router();

router.get("/", getAllQuizzes);
router.post("/", validateRequest(quizSchema), createQuiz);
router.put("/:id", validateRequest(quizSchema), updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
