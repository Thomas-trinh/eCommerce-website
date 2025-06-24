import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db";
import { User } from "../interfaces/models/User";

interface AuthenticatedRequest extends Request {
  username?: string;
  loggedInUser?: User;
}

interface JwtPayload {
  username: string;
}

export async function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.username = decoded.username;

    if (!req.username) {
      res.status(401).json({ message: "Unauthorized: username missing in token" });
      return;
    }

    const loggedInUser = await getUserByUsername(req.username);
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized: user not found" });
      return;
    }
    req.loggedInUser = loggedInUser;

    next();
  } catch (err: any) {
    console.error("JWT Verification Error:", err.name);

    if (err.name === "TokenExpiredError") {
      res.clearCookie("token");
       res.status(401).json({ message: "Session expired. Please log in again." });
       return;
    }

    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
