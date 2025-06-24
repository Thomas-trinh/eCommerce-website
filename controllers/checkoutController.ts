import { Request, Response } from "express";
import { CartData } from "../interfaces/models/Cart";
import { CustomRequest } from "../interfaces/ICustomRequest";

export function getCheckoutPage(
  getCartDataByUserId: (id: number) => Promise<CartData | undefined>,
  updateCartItems: (id: number, items: string) => Promise<void>
) {
  return async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const loggedInUser = req.loggedInUser;

      if (!loggedInUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartData = await getCartDataByUserId(loggedInUser.id);

      if (!cartData) {
        res.status(200).json({ products: [], total: "0.00" });
        return;
      }

      const cartItems = JSON.parse(cartData.items);
      const totalPrice = cartItems.reduce(
        (sum: number, item: any) => sum + Number(item.price) * (item.quantity || 1),
        0
      );

      // await updateCartItems(loggedInUser.id, "[]");

      res.status(200).json({
        products: cartItems,
        total: totalPrice.toFixed(2),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
