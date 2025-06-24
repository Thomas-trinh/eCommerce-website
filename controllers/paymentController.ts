import Stripe from "stripe";
import { Request, Response } from "express";
import { IPaymentData } from "../interfaces/IPaymentService";
import { CartData } from "../interfaces/models/Cart";
import { CustomRequest } from "../interfaces/ICustomRequest";
import { getProductById, updateProductQuantity } from "../db/details_db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
});

//Stripe 
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    console.log("Received items:", req.body.items);

    const lineItems = req.body.items.map((item: any) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images: [item.image_url || "https://dummyimage.com/400x400"], // fallback image
        },
        unit_amount: Math.round(Number(item.price) * 100), // safe number
      },
      quantity: item.quantity,
    }));

    console.log("Line items prepared:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cart",
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  }
};




export class PaymentController {
  constructor(
    private paymentService: IPaymentData,
    private getCartDataByUserId: (id: number) => Promise<CartData | undefined>
  ) {}

  public getPaymentPage = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const user = req.loggedInUser;
      if (!user) {
        res.status(401).send("Unauthorized");
        return;
      }

      const cartData = await this.getCartDataByUserId(user.id);
      const products = cartData ? JSON.parse(cartData.items) : [];
      const totalPrice = products.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0);

      res.render("payment.ejs", {
        products,
        totalPrice,
      });
    } catch (error) {
      console.error("Error rendering payment page:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  public handlePayment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const user = req.loggedInUser;
      if (!user) {
        res.status(401).send("Unauthorized");
        return;
      }
  
      const cartData = await this.getCartDataByUserId(user.id);
      const products = cartData ? JSON.parse(cartData.items) : [];
  
      // Prepare Stripe line items
      const lineItems = products.map((item: any) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.name,
            images: [item.image_url],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cart",
      });
  
      res.redirect(session.url!);
    } catch (error) {
      console.error("Stripe checkout error:", error);
      res.status(500).render("payment.ejs", {
        products: [],
        totalPrice: 0,
        message: "Payment failed. Please try again.",
      });
    }
  };
  
}