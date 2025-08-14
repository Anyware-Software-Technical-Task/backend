import { z } from "zod";

export const quizSchema = z
  .object({
    question: z.string().min(5, "Question is too short"),
    options: z
      .array(z.string().min(1))
      .min(2, "At least 2 options are required"),
    correctAnswer: z.string(),
    course: z.string().min(3),
    topic: z.string().min(3),
    dueDate: z.coerce.date().refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  })
  .refine((data) => data.options.includes(data.correctAnswer), {
    message: "Correct answer must be one of the options",
    path: ["correctAnswer"],
  });
