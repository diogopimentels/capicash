import axios from 'axios';

// Interfaces
export interface Product {
    id: string;
    title: string;
    description?: string;
    priceCents: number;
    redirectUrl: string;
    imageUrl?: string;
    slug: string;
    active: boolean;
    sales?: number;
    revenue?: number;
}

export interface CreateProductDTO {
    title: string;
    priceCents: number;
    redirectUrl: string;
    description?: string;
    imageUrl?: string;
}

export interface Withdrawal {
    id: string;
    amountCents: number;
    status: 'REQUESTED' | 'PROCESSING' | 'PAID' | 'FAILED';
    pixKey: string;
    createdAt: string;
    processedAt?: string;
}

export interface WithdrawalHistory {
    withdrawals: Withdrawal[];
    totalWithdrawn: number;
    pendingAmount: number;
}

// URL do Backend
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para injetar o Token
export const setupAPIClient = (getToken: () => Promise<string | null>) => {
    api.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

// Endpoints - Products
export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
};

// Endpoints - Withdrawals
export const requestWithdrawal = async (amountCents: number): Promise<Withdrawal> => {
    const response = await api.post('/withdrawals/request', { amountCents });
    return response.data;
};

export const getWithdrawalHistory = async (): Promise<WithdrawalHistory> => {
    const response = await api.get('/withdrawals/history');
    return response.data;
};

export const cancelWithdrawal = async (id: string): Promise<Withdrawal> => {
    const response = await api.delete(`/withdrawals/${id}/cancel`);
    return response.data;
};

// Endpoints - PIX Configuration
export const updatePixKey = async (pixKey: string, pixKeyType: string) => {
    const response = await api.put('/users/me/pix-key', { pixKey, pixKeyType });
    return response.data;
};
