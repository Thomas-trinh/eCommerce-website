import { Request, Response } from "express";
import { CartData } from "../db/cart_db";

interface CustomRequest extends Request {
  loggedInUser?: { id: number; username?: string };
}

export function getCheckoutPage(
  getCartDataByUserId: (id: number) => Promise<CartData | undefined>,
  updateCartItems: (id: number, items: string) => Promise<void>
) {
  return async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const loggedInUser = req.loggedInUser;

      if (!loggedInUser) {
        res.status(401).send("Unauthorized");
        return;
      }

      let cartData = await getCartDataByUserId(loggedInUser.id);

      if (!cartData) {
        res.render("checkout.ejs", { products: [] });
        return;
      }

      const cartItems = JSON.parse(cartData.items);
      await updateCartItems(loggedInUser.id, "[]");

      res.render("checkout.ejs", {
        products: cartItems,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
}
