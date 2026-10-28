import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import HttpError from "../errors/HttpError.js";
import { getJwtSecret } from "../services/authSecurity.js";

function readToken(request) {
  const cookie = (request.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("campus_token="));
  const cookieToken = cookie?.slice("campus_token=".length);
  const authorization = request.get("authorization");
  const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  return cookieToken || bearerToken || "";
}

export async function optionalAuth(request, _response, next) {
  const token = readToken(request);
  if (!token) {
    request.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload.sub !== "string") {
      request.user = null;
      return next();
    }

    request.user = await Student.findOne({
      _id: payload.sub,
      isActive: true,
    });
    next();
  } catch (error) {
    if (
      error?.name === "JsonWebTokenError" ||
      error?.name === "TokenExpiredError"
    ) {
      request.user = null;
      return next();
    }
    next(error);
  }
}

export default async function requireAuth(request, _response, next) {
  try {
    const token = readToken(request);
    if (!token) {
      return next(new HttpError(401, "Sign in to continue."));
    }

    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload.sub !== "string") {
      return next(new HttpError(401, "Sign in to continue."));
    }

    const student = await Student.findOne({
      _id: payload.sub,
      isActive: true,
    });
    if (!student) {
      return next(new HttpError(401, "Your account is unavailable."));
    }

    request.user = student;
    next();
  } catch (error) {
    if (
      error?.name === "JsonWebTokenError" ||
      error?.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Your sign-in has expired. Please sign in again.";
    }
    next(error);
  }
}
