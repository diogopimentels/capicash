import { publicApi } from "@/lib/public-api";

export interface PublicProduct {
    id: string;
    title: string;
    description: string;
    priceInCents: number;
    imageUrl?: string;
    sellerName: string;
}

export const productsService = {
    async getPublicProduct(id: string): Promise<PublicProduct> {
        // Calls the public endpoint that doesn't require Auth
        const response = await publicApi.get(`/products/public/${id}`);
        return response.data;
    }
};
