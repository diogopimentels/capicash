import axios from 'axios'

export interface Transaction {
    id: string
    customer: string
    email: string
    product: string
    productImage?: string
    amount: number
    status: 'pending' | 'confirmed' | 'refunded' | 'failed' | 'completed' // Normalized statuses
    date: string
}

export const salesService = {
    async getSales() {
        const response = await axios.get<Transaction[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/sales`, {
            headers: {
                Authorization: `Bearer ${await (window as any).Clerk?.session?.getToken()}`
            }
        })
        return response.data
    }
}
