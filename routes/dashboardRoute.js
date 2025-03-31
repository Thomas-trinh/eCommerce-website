import express from "express";
import { dashboardPage } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Admin dashboard route
router.get("/", verifyToken, dashboardPage);

export const dashboardRoute = router;