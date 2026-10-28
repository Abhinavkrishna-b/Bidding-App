import { Router } from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import {
  getJwtSecret,
  hashPassword,
  normalizeEmail,
  verifyPassword,
} from "../services/authSecurity.js";
import requireAuth, { optionalAuth } from "../middleware/requireAuth.js";

const router = Router();
const JWT_COOKIE_NAME = "campus_token";
const JWT_DURATION_SECONDS = 7 * 24 * 60 * 60;

function publicStudent(student) {
  return {
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    initials: student.name.trim().charAt(0).toUpperCase(),
  };
}

function setTokenCookie(response, token) {
  const secure = process.env.NODE_ENV === "production";
  response.set(
    "Set-Cookie",
    [
      `${JWT_COOKIE_NAME}=${token}`,
      "Path=/",
      `Max-Age=${JWT_DURATION_SECONDS}`,
      "HttpOnly",
      "SameSite=Lax",
      ...(secure ? ["Secure"] : []),
    ].join("; ")
  );
}

function clearTokenCookie(response) {
  response.set(
    "Set-Cookie",
    [
      `${JWT_COOKIE_NAME}=`,
      "Path=/",
      "Max-Age=0",
      "HttpOnly",
      "SameSite=Lax",
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; ")
  );
}

router.post("/signup", async (request, response, next) => {
  try {
    const jwtSecret = getJwtSecret();
    const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
    const email = normalizeEmail(request.body?.email);
    const password = request.body?.password;

    if (name.length < 2 || name.length > 100) {
      return response.status(400).json({
        error: { message: "Name must contain 2–100 characters." },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({
        error: { message: "Enter a valid email address." },
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return response.status(400).json({
        error: { message: "Password must contain 8–128 characters." },
      });
    }

    if (await Student.exists({ email })) {
      return response.status(409).json({
        error: { message: "An account already exists for this email address." },
      });
    }

    const student = await Student.create({
      name,
      email,
      passwordHash: await hashPassword(password),
    });
    const token = jwt.sign({ sub: student.id }, jwtSecret, {
      expiresIn: JWT_DURATION_SECONDS,
    });

    setTokenCookie(response, token);
    response.status(201).json({ user: publicStudent(student) });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (request, response, next) => {
  try {
    const jwtSecret = getJwtSecret();
    const email = normalizeEmail(request.body?.email);
    const password =
      typeof request.body?.password === "string" ? request.body.password : "";

    if (!email || !password || password.length > 128) {
      return response.status(400).json({
        error: { message: "Enter your email and password." },
      });
    }

    const student = await Student.findOne({ email }).select("+passwordHash");
    if (
      !student ||
      !student.isActive ||
      !(await verifyPassword(password, student.passwordHash))
    ) {
      return response.status(401).json({
        error: { message: "Email or password is incorrect." },
      });
    }

    const token = jwt.sign({ sub: student.id }, jwtSecret, {
      expiresIn: JWT_DURATION_SECONDS,
    });
    setTokenCookie(response, token);
    response.json({ user: publicStudent(student) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", optionalAuth, (request, response) => {
  response.json({ user: request.user ? publicStudent(request.user) : null });
});

router.post("/signout", (_request, response) => {
  clearTokenCookie(response);
  response.status(204).end();
});

export default router;
