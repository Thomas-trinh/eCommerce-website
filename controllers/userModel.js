import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db.js";

export function hashPassword(password) {
  const hash = createHash("sha256").update(password).digest("hex"); // Hash password
  return hash;
}

export function verifyPassword(inputPassword, storedHash) {
  const hash = createHash("sha256").update(inputPassword).digest("hex"); // Hash the input password
  return hash === storedHash; // Compare the hashes
}

export async function createToken(req, res, next) {
    // mock user
    const username = req.params.username;//.split(" ").join("");
      
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '120m'});
    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.redirect("/");
}


    export async function checkToken(req, res, next) {
        const token = req.cookies.token;
        //const user = req.params.username;
        try {
        if(!token) throw new Error('No Token Found');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded.username;
        res.status(200).json({user: req.username});

        } catch (err) {
        console.error(err);
        res.status(401).send('Unauthorised access');
        }
        }

export async function logout(req, res, next) {
  res.clearCookie("token");
  res.redirect("/");
}
