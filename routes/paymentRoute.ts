// routes/paymentRoutes.ts
import express from "express";
import { verifyToken } from "../middleware/auth";
import { PaymentService } from "../services/paymentService";
import { getCartDataByUserId } from "../db/cart_db";
import { PaymentController } from "../controllers/paymentController";

const router = express.Router();

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService, getCartDataByUserId);

router.get("/payment", verifyToken, paymentController.getPaymentPage);
router.post("/processPayment", verifyToken, paymentController.handlePayment);

export const paymentRoutes = router;
