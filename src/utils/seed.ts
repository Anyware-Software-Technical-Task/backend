import { Announcement } from "../models/announcement.model";
import { Quiz } from "../models/quiz.model";

export const seedDatabase = async () => {
  const announcementsCount = await Announcement.countDocuments();
  const quizzesCount = await Quiz.countDocuments();

  if (announcementsCount === 0) {
    await Announcement.insertMany([
      {
        title: "Welcome Back!",
        content: "New semester starts next week.",
        author: "Admin",
        role: "events",
      },
      {
        title: "Math Lecture Cancelled",
        content: "Tomorrow’s class is canceled.",
        author: "Dr. Ahmed",
        role: "math",
      },
      {
        title: "Physics Lab Schedule",
        content: "Physics lab will now be held on Wednesdays.",
        author: "Dr. Sarah",
        role: "physics",
      },
      {
        title: "Management Seminar",
        content: "Attend the seminar on project planning this Thursday.",
        author: "Prof. Khaled",
        role: "management",
      },
      {
        title: "Midterm Week",
        content: "All exams will be conducted between Oct 10–15.",
        author: "Dean Office",
        role: "events",
      },
    ]);
    console.log(" Seeded announcements");
  }

  if (quizzesCount === 0) {
    await Quiz.insertMany([
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
      {
        question: "Which is management?",
        options: ["Planning", "Dividing", "Subtracting"],
        correctAnswer: "Planning",
        course: "Management",
        topic: "Principles",
        dueDate: new Date("2025-12-25T14:00:00Z"),
      },
      {
        question: "Solve: 8 x 6",
        options: ["48", "54", "64"],
        correctAnswer: "48",
        course: "Math 101",
        topic: "Multiplication",
        dueDate: new Date("2025-12-28T08:30:00Z"),
      },
      {
        question: "Speed is calculated by:",
        options: ["Distance / Time", "Mass x Acceleration", "Energy / Time"],
        correctAnswer: "Distance / Time",
        course: "Physics 102",
        topic: "Motion",
        dueDate: new Date("2025-12-29T11:00:00Z"),
      },
    ]);
    console.log(" Seeded quizzes");
  }
};
