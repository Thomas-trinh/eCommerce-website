import { IPaymentData } from "../interfaces/IPaymentService";

export class PaymentService implements IPaymentData {
  process(data: any): { paymentMethod: string; name: string } {
    const name = data.cardName || data.visaName || "Guest";
    const method = data.paymentMethod || "unknown";
    return { paymentMethod: method, name };
  }
}
