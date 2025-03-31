import express from "express";
import { showProductDetails } from "../controllers/ProductInfo.js";

const router = express.Router();

router.get("/:id", showProductDetails);

export const detailsRoutes = router;