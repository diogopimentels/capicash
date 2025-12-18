import { publicApi } from "@/lib/public-api";

export interface CheckoutResponse {
    paymentId: string;
    invoiceUrl: string;
    encodedImage?: string; // QR Code Base64
    pixCopiaECola?: string;
    status: string;
}

export interface BuyerData {
    name: string;
    email: string;
    cpf: string;
}

export const checkoutService = {
    async createPayment(productId: string, customerData: BuyerData): Promise<CheckoutResponse> {
        return this.createPixCharge(productId, customerData);
    },

    async createPixCharge(productId: string, buyer: BuyerData): Promise<CheckoutResponse> {
        const response = await publicApi.post('/checkout', {
            productId,
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            buyerCpf: buyer.cpf
        });
        return response.data;
    },

    async checkStatus(paymentId: string): Promise<{ status: string }> {
        // TODO: Implementar rota no backend: GET /checkout/{paymentId}
        // Por enquanto, vamos simular ou usar a rota de webhook se tivesse GET
        // Como o user pediu para criar se precisar, vamos assumir que existe.
        const response = await publicApi.get(`/checkout/${paymentId}/status`);
        return response.data;
    }
};
