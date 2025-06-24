import { Request, Response } from "express";
import sql from "../config/dbconfig";
import transporter from "./emailService";
import * as userModel from "./userModel";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db";

interface User {
  username: string;
  email: string;
  password_hash: string;
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const token = req.cookies.token;

  try {
    if (!token) throw new Error("No Token Found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { username: string };
    const loggedInUser = await getUserByUsername(decoded.username);

    res.render("user.ejs", {
      user: loggedInUser,
    });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorised access");
  }
}

export function showRegister(req: Request, res: Response): void {
  res.render("register.ejs");
}

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const { userName, email, password } = req.body;
  const hash = await userModel.hashPassword(password);

  const checkUser = await sql`SELECT username FROM users WHERE email = ${email}`;
  if (checkUser.length > 0) {
    res.status(409).json({ message: "You might have already registered. Try logging in." });
  } else {
    const user: User = {
      username: userName,
      email,
      password_hash: hash,
    };

    await sql`INSERT INTO users ${sql(user)}`;
    const result = await sql`SELECT username FROM users WHERE email = ${email}`;
    const registeredUser = result[0]?.username;

    res.status(201).json({ message: `Hi ${userName}, you've been registered.` });
  }
}

export function showLogin(req: Request, res: Response): void {
  res.render("login.ejs");
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const result = await sql`SELECT username, id, password_hash FROM users WHERE email = ${email}`;
  if (result.length > 0) {
    const { username, password_hash } = result[0];
    if (userModel.verifyPassword(password, password_hash)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "10h" });
      // const token = jwt.sign({ username }, process.env.JWT_SECRET as string); // no expiresIn
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true in production with HTTPS
          sameSite: "lax", // or "strict"
          maxAge: 10 * 60 * 60 * 1000, // 10 hours
        })
        .status(200)
        .json({
          message: `Welcome back, ${username}!`,
          username,
        });
    } else {
      res.status(404).render("login", {
        message: "Your email and password do not match. Please try again, or register",
      });
    }
  } else {
    res.status(404).render("login", {
      message: "Your email does not seem to be registered. Please try again, or register",
    });
  }
}

export function showresetPassword(req: Request, res: Response): void {
  res.render("reset-password.ejs");
}

export async function handlePasswordReset(req: Request, res: Response): Promise<void> {
  try {
    const email: string = req.body.email;
    const result = await sql`SELECT username, email FROM users WHERE email = ${email}`;

    if (result.length > 0) {
      const { username, email: useremail } = result[0];
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '10h' });
      // const token = jwt.sign({ username }, process.env.JWT_SECRET as string); // no expiresIn
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      const mailOptions = {
        from: "t.elegance.service.team@gmail.com",
        to: useremail,
        subject: "Password Reset Request. Please do not reply as this is automation!",
        text: `Hi!, here is your link to reset your password. http://localhost:3000/new-password?token=${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).render("reset-password", {
            message: "You have been sent an email to reset your password! Check your email and click the link, or try again.",
          });
        }
      });
    } else {
      res.status(500).render("reset-password", {
        message: "That email does not seem to match a registered user. Please make sure you are registered and enter the correct email.",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function showNewPassword(req: Request, res: Response): void {
  res.render("reset-password-form.ejs");
}

export async function handleNewPassword(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("No Token Found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { username: string };
    const username = decoded.username;
    const password = req.body.newPassword;

    const hash = await userModel.hashPassword(password);
    await sql`UPDATE users SET password_hash = ${hash} WHERE username = ${username}`;
    res.clearCookie("token");

    res.render("login", {
      message: `Hi ${username}!, Your password was reset successfully, please log in`,
    });
  } catch (error) {
    console.log(error);
  }
}


export function logout(req: Request, res: Response): void {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
}


// export async function handleNewPassword(req: Request, res: Response): Promise<void> {
//   try {
//     const { token, newPassword } = req.body;

//     if (!token || !newPassword) {
//       res.status(400).json({ message: "Token or new password missing." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { username: string };
//     const username = decoded.username;

//     const hash = await userModel.hashPassword(newPassword);
//     await sql`UPDATE users SET password_hash = ${hash} WHERE username = ${username}`;

//     res.status(200).json({ message: `Hi ${username}! Your password was reset successfully.` });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "Invalid or expired token. Please try again." });
//   }
// }
