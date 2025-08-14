import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  author: z.string().min(2, "Author name is too short"),
  role: z.enum(["math", "physics", "management", "events", "other"], {
    errorMap: () => ({ message: "Invalid role type" }),
  }),
});
