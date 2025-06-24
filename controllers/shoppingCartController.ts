import { Request, Response } from "express";
import {
  createUserInCartTable,
  getCartDataByUserId,
  updateCartItems,
} from "../db/cart_db";
import { getProductById } from "../db/details_db";
import { Product } from "../interfaces/models/Product";

// Extend Express Request to include loggedInUser
interface CustomRequest extends Request {
  loggedInUser?: {
    id: number;
    username?: string;
  };
}

// GET /shoppingCart
export const getCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let data = await getCartDataByUserId(loggedInUser.id);
    if (!data) {
      await createUserInCartTable(loggedInUser.id, "[]");
      data = { user_id: loggedInUser.id, items: "[]" };
    }

    const cartItems: Product[] = JSON.parse(data.items);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );

    res.status(200).json({
      products: cartItems,
      totalPrice: totalPrice.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /add/:id
export const addItemToCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const productId = parseInt(req.params.id);
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let cartItems: Product[] = [];
    const data = await getCartDataByUserId(loggedInUser.id);

    if (!data) {
      await createUserInCartTable(loggedInUser.id, "[]");
    } else {
      cartItems = JSON.parse(data.items);
    }

    const index = cartItems.findIndex(item => item.id === product.id);

    if (index !== -1) {
      cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    await updateCartItems(loggedInUser.id, JSON.stringify(cartItems));

    res.status(200).json({ message: "Item added to cart", cart: cartItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// POST /remove/:id
export const removeCartItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const indexToRemove = parseInt(req.params.id);
    let data = await getCartDataByUserId(loggedInUser.id);
    if (!data) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const cartItems: Product[] = JSON.parse(data.items);
    if (indexToRemove >= 0 && indexToRemove < cartItems.length) {
      cartItems.splice(indexToRemove, 1);
      await updateCartItems(loggedInUser.id, JSON.stringify(cartItems));
    }

    res.status(200).json({ message: "Item removed", cart: cartItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /cart/items
export const getItemsNumberInCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).send("Unauthorised access");
      return;
    }

    let data = await getCartDataByUserId(loggedInUser.id);
    if (!data) {
      await createUserInCartTable(loggedInUser.id, "[]");
      data = { user_id: loggedInUser.id, items: "[]" };
    }

    const cartItems: Product[] = JSON.parse(data.items);
    res.status(200).json({ number: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const updateCartQuantity = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const user = req.loggedInUser;
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const productId = parseInt(req.params.id);
    const { change } = req.body; // e.g., { change: -1 }

    let cartData = await getCartDataByUserId(user.id);
    if (!cartData) {
      res.status(404).send("Cart not found");
      return;
    }

    let cartItems: Product[] = JSON.parse(cartData.items);
    const index = cartItems.findIndex((item) => item.id === productId);
    if (index === -1){
       res.status(404).send("Item not found");
       return;
    }

    cartItems[index].quantity = (cartItems[index].quantity || 1) + change;

    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }

    await updateCartItems(user.id, JSON.stringify(cartItems));
    res.status(200).send("Cart updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};