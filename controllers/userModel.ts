import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db";

// Hash a plain password using SHA-256
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Compare input password with stored hash
export function verifyPassword(inputPassword: string, storedHash: string): boolean {
  const hash = createHash("sha256").update(inputPassword).digest("hex");
  return hash === storedHash;
}

// Middleware to create and send token
export async function createToken(request: Request, response: Response): Promise<void> {
  const username = request.params.username;

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "120m" });

  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  response.redirect("/");
}

// Middleware to verify JWT token
interface AuthenticatedRequest extends Request {
  username?: string;
}

export async function checkToken(request: AuthenticatedRequest, response: Response): Promise<void> {
  const token = request.cookies.token;

  try {
    if (!token) throw new Error("No Token Found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    request.username = decoded.username;

    response.status(200).json({ user: request.username });
  } catch (error) {
    console.error("Token verification failed:", error);
    response.status(401).send("Unauthorized access");
  }
}

// Logout and clear the token cookie
export async function logout(request: Request, response: Response): Promise<void> {
  response.clearCookie("token");
  response.redirect("/");
}
