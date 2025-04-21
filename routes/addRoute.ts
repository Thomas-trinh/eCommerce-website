import express from "express";
import { addPro, addProduct } from "../controllers/addController";

const router = express.Router();

// GET route to render the Add Product form
router.get("/add", addPro);

// POST route to handle the form submission
router.post("/add", addProduct);

export const addingRoutes = router;