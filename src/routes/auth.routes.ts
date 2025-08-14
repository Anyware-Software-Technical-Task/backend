import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const validEmail = process.env.LOGIN_EMAIL;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "2h",
    });

    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
