import express from "express";
import {
  showLogin,
  handleLogin,
  handleRegister,
  showRegister,
  showresetPassword,
  showNewPassword,
  handlePasswordReset,
  handleNewPassword,
} from "../controllers/userController.js";

import * as userModel from "../controllers/userModel.js";
const router = express.Router();

router.get("/register", showRegister); // GET req for register page renders the register page
router.post("/register", handleRegister); //On a post request on the register form, the registration function is called

router.get("/login", showLogin); // GET req for login page renders the login page
router.post("/login", handleLogin); //On a post request on the login form, the login function is called


router.get("/token/:username?", userModel.createToken); //creates token on login
router.get("/checkToken", userModel.checkToken); //checks token when needed

router.get("/logout", userModel.logout); //Deletes token on logout

router.get("/reset-password", showresetPassword); // GET req for password reset page renders the password reset page
router.post("/reset-password", handlePasswordReset); //On a post request on the register form, the registration function is called

router.get("/new-password/:token?", showNewPassword); // GET req for new password page from user email renders the new password form page
router.post("/new-password", handleNewPassword); // On a post request on the new password form, the handle new password function is called

export const authEventHandler = router;
