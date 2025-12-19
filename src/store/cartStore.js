import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (produto) => set((state) => {
        const existing = state.items.find(item => item.id === produto.id);
        if (existing) {
          return {
            items: state.items.map(item =>
              item.id === produto.id 
                ? { ...item, quantidade: item.quantidade + 1 } 
                : item
            )
          };
        }
        return { items: [...state.items, { ...produto, quantidade: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantidade) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantidade: Math.max(1, quantidade) } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantidade, 0),

      // Agora retorna STRING já no formato BR (com vírgula)
      getTotalPrice: () => {
        const total = get().items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        return total.toFixed(2).replace('.', ',');
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;