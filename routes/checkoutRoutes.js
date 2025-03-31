import express from 'express';
import { getCheckoutPage } from '../controllers/checkoutController.js';// Importing the controller functions
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getCheckoutPage);// Route to show the checkout page

export const checkoutRoutes = router;
