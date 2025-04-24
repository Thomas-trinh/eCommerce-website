import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db";
import { User } from "../interfaces/models/User";

// Extend Express Request to include custom fields
interface AuthenticatedRequest extends Request {
  username?: string;
  loggedInUser?: User;
}

// Define the expected shape of JWT payload
interface JwtPayload {
  username: string;
}

// Auth middleware
export async function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new Error("No Token Found");
    }

    // Decode token and assert payload structure
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.username = decoded.username;

    if (!req.username) {
      res.status(401).send("Unauthorized: username missing in token");
      return;
    }

    const loggedInUser = await getUserByUsername(req.username);
    if (!loggedInUser) {
      res.status(401).send("Unauthorized: user not found");
      return;
    }

    req.loggedInUser = loggedInUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorized access");
  }
}
