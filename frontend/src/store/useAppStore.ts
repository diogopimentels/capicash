import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
    id: string
    title: string
    price: number
    sales: number
    revenue: number
    link: string
    createdAt: string
}

interface AppState {
    isAuthenticated: boolean
    user: { email: string; name: string } | null
    products: Product[]
    balance: number
    login: (email: string, password?: string) => void
    logout: () => void
    addProduct: (product: Product) => void
    addSale: (productId: string, amount: number) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            products: [],
            balance: 0,
            login: (email) => set({ isAuthenticated: true, user: { email, name: email.split('@')[0] } }),
            logout: () => set({ isAuthenticated: false, user: null }),
            addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
            addSale: (productId, amount) =>
                set((state) => ({
                    balance: state.balance + amount,
                    products: state.products.map((p) =>
                        p.id === productId
                            ? { ...p, sales: p.sales + 1, revenue: p.revenue + amount }
                            : p
                    ),
                })),
        }),
        {
            name: 'libera-storage',
        }
    )
)
