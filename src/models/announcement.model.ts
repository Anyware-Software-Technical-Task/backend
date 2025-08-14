import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    role: {
      type: String,
      enum: ["math", "physics", "management", "events", "other"],
      default: "other",
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
