import request from "supertest";
import express from "express";
import { Announcement } from "../models/announcement.model";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import { errorHandler } from "../middlewares/errorHandler";

const app = express();
app.use(express.json());

// Setup routes for testing
app.get("/announcements", getAllAnnouncements);
app.post("/announcements", createAnnouncement);
app.put("/announcements/:id", updateAnnouncement);
app.delete("/announcements/:id", deleteAnnouncement);
app.use(errorHandler);

describe("Announcement Controller", () => {
  describe("GET /announcements", () => {
    it("should return all announcements", async () => {
      // Create test announcements
      const testAnnouncements = [
        {
          title: "Test Announcement 1",
          content: "This is test content 1",
          author: "Test Author 1",
          role: "math" as const,
        },
        {
          title: "Test Announcement 2",
          content: "This is test content 2",
          author: "Test Author 2",
          role: "physics" as const,
        },
      ];

      await Announcement.insertMany(testAnnouncements);

      const response = await request(app).get("/announcements");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe("Test Announcement 1");
      expect(response.body[1].title).toBe("Test Announcement 2");
    });

    it("should return empty array when no announcements exist", async () => {
      const response = await request(app).get("/announcements");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("POST /announcements", () => {
    it("should create a new announcement", async () => {
      const newAnnouncement = {
        title: "New Test Announcement",
        content: "This is new test content",
        author: "New Test Author",
        role: "management" as const,
      };

      const response = await request(app)
        .post("/announcements")
        .send(newAnnouncement);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newAnnouncement.title);
      expect(response.body.content).toBe(newAnnouncement.content);
      expect(response.body.author).toBe(newAnnouncement.author);
      expect(response.body.role).toBe(newAnnouncement.role);
      expect(response.body._id).toBeDefined();
    });
  });
});
