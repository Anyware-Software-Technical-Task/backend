import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import announcementRoutes from "./routes/announcement.routes";
import quizRoutes from "./routes/quiz.routes";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import { seedDatabase } from "./utils/seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/announcements", announcementRoutes);
app.use("/api/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use(errorHandler);

// DB connect + start server

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log(" MongoDB connected");
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
