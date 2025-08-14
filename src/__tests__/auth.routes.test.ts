import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { errorHandler } from "../middlewares/errorHandler";

const app = express();
app.use(express.json());

// Setup routes for testing
app.use("/auth", authRoutes);
app.use(errorHandler);

describe("Auth Routes", () => {
  describe("POST /auth/login", () => {
    it("should login with valid credentials", async () => {
      const validCredentials = {
        email: "test@anyware.com",
        password: "123456",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(validCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it("should reject invalid email", async () => {
      const invalidCredentials = {
        email: "wrong@email.com",
        password: "123456",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should reject invalid password", async () => {
      const invalidCredentials = {
        email: "test@anyware.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should reject missing email", async () => {
      const invalidCredentials = {
        password: "123456",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should reject missing password", async () => {
      const invalidCredentials = {
        email: "test@anyware.com",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should reject empty request body", async () => {
      const response = await request(app).post("/auth/login").send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
