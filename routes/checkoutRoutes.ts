import express from 'express';
import { verifyToken } from "../middleware/auth";
import { getCheckoutPage } from "../controllers/checkoutController";
import { getCartDataByUserId, updateCartItems } from "../db/cart_db";

const router = express.Router();

router.get("/", verifyToken, getCheckoutPage(getCartDataByUserId, updateCartItems));// Route to show the checkout page

export const checkoutRoutes = router;
