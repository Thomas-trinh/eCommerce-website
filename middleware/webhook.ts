import Stripe from "stripe";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { updateProductQuantity } from "../db/details_db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment received:", session.id);
    }

    res.status(200).send("Webhook received");
  }
);

export default router;
