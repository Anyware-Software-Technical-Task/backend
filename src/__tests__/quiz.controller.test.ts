import request from "supertest";
import express from "express";
import { Quiz } from "../models/quiz.model";
import {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.controller";
import { errorHandler } from "../middlewares/errorHandler";

const app = express();
app.use(express.json());

// Setup routes for testing
app.get("/quizzes", getAllQuizzes);
app.post("/quizzes", createQuiz);
app.put("/quizzes/:id", updateQuiz);
app.delete("/quizzes/:id", deleteQuiz);
app.use(errorHandler);

describe("Quiz Controller", () => {
  describe("GET /quizzes", () => {
    it("should return all quizzes", async () => {
      // Create test quizzes
      const testQuizzes = [
        {
          question: "What is 5 + 7?",
          options: ["10", "12", "14"],
          correctAnswer: "12",
          course: "Math 101",
          topic: "Addition",
          dueDate: new Date("2025-12-20T09:00:00Z"),
        },
        {
          question: "What is the unit of Force?",
          options: ["Joule", "Newton", "Watt"],
          correctAnswer: "Newton",
          course: "Physics 101",
          topic: "Forces",
          dueDate: new Date("2025-12-22T10:00:00Z"),
        },
      ];

      await Quiz.insertMany(testQuizzes);

      const response = await request(app).get("/quizzes");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].question).toBe("What is 5 + 7?");
      expect(response.body[1].question).toBe("What is the unit of Force?");
      expect(response.body[0]._id).toBeDefined();
      expect(response.body[1]._id).toBeDefined();
    });

    it("should return empty array when no quizzes exist", async () => {
      const response = await request(app).get("/quizzes");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("POST /quizzes", () => {
    it("should create a new quiz", async () => {
      const newQuiz = {
        question: "What is 8 x 6?",
        options: ["48", "54", "64"],
        correctAnswer: "48",
        course: "Math 101",
        topic: "Multiplication",
        dueDate: new Date("2025-12-28T08:30:00Z"),
      };

      const response = await request(app).post("/quizzes").send(newQuiz);

      expect(response.status).toBe(201);
      expect(response.body.question).toBe(newQuiz.question);
      expect(response.body.options).toEqual(newQuiz.options);
      expect(response.body.correctAnswer).toBe(newQuiz.correctAnswer);
      expect(response.body.course).toBe(newQuiz.course);
      expect(response.body.topic).toBe(newQuiz.topic);
      expect(response.body._id).toBeDefined();
    });
  });

  describe("PUT /quizzes/:id", () => {
    it("should update an existing quiz", async () => {
      // Create a quiz first
      const quiz = new Quiz({
        question: "Original question",
        options: ["A", "B", "C"],
        correctAnswer: "A",
        course: "Test Course",
        topic: "Test Topic",
        dueDate: new Date("2025-12-30T10:00:00Z"),
      });
      await quiz.save();

      const updateData = {
        question: "Updated question",
        options: ["X", "Y", "Z"],
        correctAnswer: "Y",
      };

      const response = await request(app)
        .put(`/quizzes/${quiz._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.question).toBe("Updated question");
      expect(response.body.options).toEqual(["X", "Y", "Z"]);
      expect(response.body.correctAnswer).toBe("Y");
      expect(response.body.course).toBe("Test Course");
    });

    it("should return 404 for non-existent quiz", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .put(`/quizzes/${fakeId}`)
        .send({ question: "Updated" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Not found");
    });
  });

  describe("DELETE /quizzes/:id", () => {
    it("should delete an existing quiz", async () => {
      // Create a quiz first
      const quiz = new Quiz({
        question: "Question to delete",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Test Course",
        topic: "Test Topic",
        dueDate: new Date("2025-12-30T10:00:00Z"),
      });
      await quiz.save();

      const response = await request(app).delete(`/quizzes/${quiz._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Deleted successfully");

      // Verify it's actually deleted
      const deletedQuiz = await Quiz.findById(quiz._id);
      expect(deletedQuiz).toBeNull();
    });

    it("should return 404 for non-existent quiz", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app).delete(`/quizzes/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Not found");
    });
  });
});
