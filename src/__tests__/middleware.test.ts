import request from "supertest";
import express from "express";
import { errorHandler } from "../middlewares/errorHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { announcementSchema } from "../validators/announcement.validator";

const app = express();
app.use(express.json());

describe("Middleware", () => {
  describe("Error Handler", () => {
    it("should handle generic errors", async () => {
      app.get("/test-error", (req, res, next) => {
        next(new Error("Test error message"));
      });
      app.use(errorHandler);

      const response = await request(app).get("/test-error");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Test error message");
    });

    it("should handle errors with custom status code", async () => {
      app.get("/test-status-error", (req, res, next) => {
        const error: any = new Error("Not found");
        error.statusCode = 404;
        res.statusCode = 404;
        next(error);
      });
      app.use(errorHandler);

      const response = await request(app).get("/test-status-error");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Not found");
    });

    it("should provide default message for errors without message", async () => {
      app.get("/test-no-message", (req, res, next) => {
        const error = new Error();
        next(error);
      });
      app.use(errorHandler);

      const response = await request(app).get("/test-no-message");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Something went wrong");
    });
  });

  describe("Validation Middleware", () => {
    it("should pass valid data", async () => {
      app.post(
        "/test-valid",
        validateRequest(announcementSchema),
        (req, res) => {
          res.json({ success: true, data: req.body });
        }
      );
      app.use(errorHandler);

      const validData = {
        title: "Valid Title",
        content: "This is valid content",
        author: "John Doe",
        role: "math",
      };

      const response = await request(app).post("/test-valid").send(validData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(validData);
    });

    it("should reject invalid data", async () => {
      app.post(
        "/test-invalid",
        validateRequest(announcementSchema),
        (req, res) => {
          res.json({ success: true, data: req.body });
        }
      );
      app.use(errorHandler);

      const invalidData = {
        title: "Hi",
        content: "This is valid content",
        author: "John Doe",
        role: "math",
      };

      const response = await request(app)
        .post("/test-invalid")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it("should handle multiple validation errors", async () => {
      app.post(
        "/test-multiple-errors",
        validateRequest(announcementSchema),
        (req, res) => {
          res.json({ success: true, data: req.body });
        }
      );
      app.use(errorHandler);

      const invalidData = {
        title: "Hi", // Too short
        content: "Hi", // Too short
        author: "A", // Too short
        role: "invalid_role", // Invalid role
      };

      const response = await request(app)
        .post("/test-multiple-errors")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(1);
    });

    it("should handle missing required fields", async () => {
      app.post(
        "/test-missing-fields",
        validateRequest(announcementSchema),
        (req, res) => {
          res.json({ success: true, data: req.body });
        }
      );
      app.use(errorHandler);

      const invalidData = {
        title: "Valid Title",
        // Missing content, author, role
      };

      const response = await request(app)
        .post("/test-missing-fields")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toBeDefined();
    });
  });
});
