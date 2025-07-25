import express from "express";
import { addItemToCart, getCart, removeCartItem, getItemsNumberInCart, updateCartQuantity } from "../controllers/shoppingCartController";  // Importing the controller functions
import { verifyToken } from "../middleware/auth";

const router = express.Router(); 

router.get("/", verifyToken ,getCart); 
router.get("/items", verifyToken, getItemsNumberInCart)
router.post("/add/:id", verifyToken, addItemToCart);
router.post("/remove/:id", verifyToken, removeCartItem);
router.post("/update/:id", verifyToken, updateCartQuantity);

export const cartRoutes = router;  