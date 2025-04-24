export interface IPaymentData {
    process(data: any): {
        paymentMethod: string;
        name: string;
    }
}