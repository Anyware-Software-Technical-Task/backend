import { announcementSchema } from "../validators/announcement.validator";
import { quizSchema } from "../validators/quiz.validator";

describe("Validators", () => {
  describe("Announcement Schema", () => {
    it("should validate valid announcement data", () => {
      const validAnnouncement = {
        title: "Valid Title",
        content: "This is valid content with more than 5 characters",
        author: "John Doe",
        role: "math",
      };

      const result = announcementSchema.safeParse(validAnnouncement);
      expect(result.success).toBe(true);
    });

    it("should reject title less than 3 characters", () => {
      const invalidAnnouncement = {
        title: "Hi",
        content: "This is valid content",
        author: "John Doe",
        role: "math",
      };

      const result = announcementSchema.safeParse(invalidAnnouncement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Title must be at least 3 characters"
        );
      }
    });

    it("should reject content less than 5 characters", () => {
      const invalidAnnouncement = {
        title: "Valid Title",
        content: "Hi",
        author: "John Doe",
        role: "math",
      };

      const result = announcementSchema.safeParse(invalidAnnouncement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Content must be at least 5 characters"
        );
      }
    });

    it("should reject author less than 2 characters", () => {
      const invalidAnnouncement = {
        title: "Valid Title",
        content: "This is valid content",
        author: "A",
        role: "math",
      };

      const result = announcementSchema.safeParse(invalidAnnouncement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Author name is too short");
      }
    });

    it("should reject invalid role", () => {
      const invalidAnnouncement = {
        title: "Valid Title",
        content: "This is valid content",
        author: "John Doe",
        role: "invalid_role",
      };

      const result = announcementSchema.safeParse(invalidAnnouncement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid role type");
      }
    });

    it("should accept all valid roles", () => {
      const validRoles = ["math", "physics", "management", "events", "other"];

      validRoles.forEach((role) => {
        const validAnnouncement = {
          title: "Valid Title",
          content: "This is valid content",
          author: "John Doe",
          role,
        };

        const result = announcementSchema.safeParse(validAnnouncement);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Quiz Schema", () => {
    it("should validate valid quiz data", () => {
      const validQuiz = {
        question: "What is 5 + 7?",
        options: ["10", "12", "14"],
        correctAnswer: "12",
        course: "Math 101",
        topic: "Addition",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(validQuiz);
      expect(result.success).toBe(true);
    });

    it("should reject question less than 5 characters", () => {
      const invalidQuiz = {
        question: "Hi",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Math 101",
        topic: "Addition",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Question is too short");
      }
    });

    it("should reject less than 2 options", () => {
      const invalidQuiz = {
        question: "What is 5 + 7?",
        options: ["A"],
        correctAnswer: "A",
        course: "Math 101",
        topic: "Addition",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "At least 2 options are required"
        );
      }
    });

    it("should reject course less than 3 characters", () => {
      const invalidQuiz = {
        question: "What is 5 + 7?",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Hi",
        topic: "Addition",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "String must contain at least 3 character(s)"
        );
      }
    });

    it("should reject topic less than 3 characters", () => {
      const invalidQuiz = {
        question: "What is 5 + 7?",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Math 101",
        topic: "Hi",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "String must contain at least 3 character(s)"
        );
      }
    });

    it("should reject past due date", () => {
      const invalidQuiz = {
        question: "What is 5 + 7?",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Math 101",
        topic: "Addition",
        dueDate: new Date("2020-01-01T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Due date must be in the future"
        );
      }
    });

    it("should reject correct answer not in options", () => {
      const invalidQuiz = {
        question: "What is 5 + 7?",
        options: ["A", "B"],
        correctAnswer: "C",
        course: "Math 101",
        topic: "Addition",
        dueDate: new Date("2025-12-20T09:00:00Z"),
      };

      const result = quizSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Correct answer must be one of the options"
        );
      }
    });

    it("should accept string due date and convert to Date", () => {
      const validQuiz = {
        question: "What is 5 + 7?",
        options: ["A", "B"],
        correctAnswer: "A",
        course: "Math 101",
        topic: "Addition",
        dueDate: "2025-12-20T09:00:00Z",
      };

      const result = quizSchema.safeParse(validQuiz);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBeInstanceOf(Date);
      }
    });
  });
});
