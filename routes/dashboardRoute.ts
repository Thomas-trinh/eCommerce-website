import express from "express";
import { dashboardPage } from "../controllers/dashboardController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Admin dashboard route
router.get("/", verifyToken, dashboardPage);

export const dashboardRoute = router;