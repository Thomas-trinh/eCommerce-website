import express from "express";
import { addItemToCart, getCart, removeCartItem, getItemsNumberInCart } from "../controllers/shoppingCartController";  // Importing the controller functions
import { verifyToken } from "../middleware/auth";

const router = express.Router(); 

router.get("/", verifyToken ,getCart); 
router.get("/items", verifyToken, getItemsNumberInCart)
router.post("/add/:id", verifyToken, addItemToCart);
router.post("/remove/:id", verifyToken, removeCartItem);

export const cartRoutes = router;  