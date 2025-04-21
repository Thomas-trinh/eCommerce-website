import { Request, Response } from "express";
import {
  createUserInCartTable,
  getCartDataByUserId,
  updateCartItems,
} from "../db/cart_db";
import { getProductById } from "../db/details_db";
import { Product } from "../db/products_db";

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
      res.status(401).send("Unauthorised access");
      return;
    }

    let data = await getCartDataByUserId(loggedInUser.id);
    if (!data) {
      await createUserInCartTable(loggedInUser.id, "[]");
      data = { user_id: loggedInUser.id, items: "[]" };
    }

    const cartItems: Product[] = JSON.parse(data.items);
    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    res.render("cart.ejs", {
      products: cartItems,
      totalPrice: new Intl.NumberFormat("en-IN", {
        maximumSignificantDigits: 5,
      }).format(totalPrice),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// POST /add/:id
export const addItemToCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).send("Unauthorised access");
      return;
    }

    const productId = parseInt(req.params.id);
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    let cartItems: Product[] = [];
    const data = await getCartDataByUserId(loggedInUser.id);

    if (!data) {
      await createUserInCartTable(loggedInUser.id, "[]");
    } else {
      cartItems = JSON.parse(data.items);
    }

    cartItems.push(product);
    await updateCartItems(loggedInUser.id, JSON.stringify(cartItems));

    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// POST /remove/:id
export const removeCartItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.loggedInUser;
    if (!loggedInUser) {
      res.status(401).send("Unauthorised access");
      return;
    }

    const indexToRemove = parseInt(req.params.id);
    let data = await getCartDataByUserId(loggedInUser.id);
    if (!data) {
      res.redirect("/shoppingCart");
      return;
    }

    const cartItems: Product[] = JSON.parse(data.items);

    if (indexToRemove >= 0 && indexToRemove < cartItems.length) {
      cartItems.splice(indexToRemove, 1);
      await updateCartItems(loggedInUser.id, JSON.stringify(cartItems));
    }

    res.redirect("/shoppingCart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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
