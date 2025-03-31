import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db.js";

export async function verifyToken(req, res, next) {
  const token = req.cookies.token;
  //const user = req.params.username;
  try {
    if (!token) throw new Error("No Token Found");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decoded.username;
    const loggedInUser = await getUserByUsername(req.username);

    req.loggedInUser = loggedInUser
    next();

  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorised access");
  }
}
