import sql from "../config/dbconfig.js";
import transporter from "./emailService.js";
import * as userModel from "../controllers/userModel.js";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../db/user_db.js";

export async function getUser(req, res) {
  const token = req.cookies.token;

    try {
      if (!token) throw new Error("No Token Found");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.username = decoded.username;
      const loggedInUser = await getUserByUsername(req.username);

      res.render("user.ejs", {
        user: loggedInUser,
      });

    } catch (err) {
      console.error(err);
      res.status(401).send("Unauthorised access");
    }
}

export function showRegister(req, res) {
  res.render("register.ejs"); //renders the register page
}

export async function handleRegister(req, res) {
  //try {
    const { userName, email, password } = req.body; //acquires form information
    const hash = await userModel.hashPassword(password); //hashes password

    const checkUser = await sql`SELECT username FROM users WHERE email = ${email}`;
    if (checkUser.length > 0) {
      res
      .status(403)
      .render("register", {
        message: "You might have already registered, try logging in.",
      });
    } else {  
    const user = {
      //creates user object to enter into database
      username: userName,
      email: email,
      password_hash: hash,
    };
    await sql`INSERT INTO users ${sql(user)}`; //database insert

    const result = await sql`select username from users WHERE email = ${email}`;
    const registeredUser = result[0]?.username;
    res
    .status(200)
    .render("login", {
      message: `Hi ${registeredUser}!, You've been registered.`,
    }); //displays registered user 
    }
  // } catch (error) {
  //   res
  //     .status(500)
  //     .render("register", {
  //       message: "Something went wrong - please register again and ensure you use correct details",
  //     });
  //   console.log(error);
  // }
  //redirect to login page on successful registration
}

export function showLogin(req, res) {
  //render login page
  res.render("login.ejs");
}

export async function handleLogin(req, res) {

  const { email, password } = req.body; //get details from form

  const result =
    await sql`SELECT username, id, password_hash FROM users WHERE email = ${email}`; //get password hash

  if (result.length > 0) {
    const { username, password_hash, id } = result[0];

    if (userModel.verifyPassword(password, password_hash)) {
      //validate user credentials
      
      res
      .status(200)
      .redirect(`/token/${username}`);
  
    } else {
      res
        .status(404)
        .render("login", {
          message:
            "Your email and password do not match. Please try again, or register",
        });
    }
  } else {
    res
      .status(404)
      .render("login", {
        message:
          "Your email does not seem to be registered. Please try again, or register",
      });
  }
  //redirect to welcome + products page on successful registration
}

export function showresetPassword(req, res) {
  res.render("reset-password.ejs"); //render password reset page
}

export async function handlePasswordReset(req, res) {
  try {
    //get user email
    const email = req.body.email;
    
    //check for existing email
    const result = await sql`SELECT username, email FROM users WHERE email = ${email}`;


    //if email is found
    if (result.length > 0) {
      const useremail = result[0]?.email;

      const username = result[0]?.username;//split(" ").join("");
      
      //create token
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '10m'});
      res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'strict'
      });

      // create mail options
      const mailOptions = {
        from: "ecocampusexchange@gmail.com",
        to: useremail,
        subject: "Password Reset Request",
        text:
          "Hi!, here is your link to reset your password." +
          `http://localhost:3000/new-password?${token}`,

      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {

          //console.log("Email sent: " + info.response);
          
          res
          .status(200)
          .render("reset-password", {
            message:
              "You have been sent an email to reset your password! Check your email and click the link, or try again.",
          });
        }
      });
      //if email is not found
    } else {
      res
        .status(500)
        .render("reset-password", {
          message:
            "That email does not seem to match a registered user. Please make sure you are registered and enter the correct email.",
        });
    }
  } catch (error) {
    console.log(error);
  }
}

export function showNewPassword(req, res) {
  res.render("reset-password-form.ejs"); //render new password page
}

export async function handleNewPassword(req, res) {
  // get new password
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("No Token Found");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.username = decoded.username;
      const username = req.username;

        //console.log(username);

      const password = req.body.newPassword;
        //console.log(password);

      const hash = userModel.hashPassword(password);
        //console.log(hash);

        //const result = await sql`SELECT * FROM users WHERE username = ${username};`;
        //console.log(result); 

        await sql`UPDATE users SET password_hash = ${hash} WHERE username = ${username};`;

        res.clearCookie("token");
        res.render("login", {
          message: `Hi ${username}!, Your password was reset successfully, please log in`,
        });
      //hashes password
      //console.log(password);
    
  } catch (error) {
    console.log(error);
  }
  // update database with new password
  // render reset success
}
