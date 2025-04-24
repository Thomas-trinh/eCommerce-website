import { Response } from "express";
import { IPaymentData } from "../interfaces/IPaymentService";
import { CartData } from "../interfaces/models/Cart";
import { CustomRequest } from "../interfaces/ICustomRequest";

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
      const paymentInfo = this.paymentService.process(req.body);
      // Save order / audit log here if needed

      res.redirect("/checkout");
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).render("payment.ejs", {
        products: [],
        totalPrice: 0,
        message: "Payment failed. Please try again.",
      });
    }
  };
}
