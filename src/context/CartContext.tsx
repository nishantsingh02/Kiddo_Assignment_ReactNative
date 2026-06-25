import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  local_image?: string;
}

interface CartState {
  items: Record<string, CartItem>;    // Keyed by product id
  quantities: Record<string, number>; // Derived fast-lookup for quantities
  totalCount: number;
  couponCode: string | null;
  couponDiscount: number; // percentage or flat discount value
  couponType: 'percent' | 'flat' | null;
  isCartOpen: boolean;

  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyCoupon: (code: string) => void;
  applyMysteryGift: (code: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const cartStore = create<CartState>()((set, get) => ({
  items: {},
  quantities: {},
  totalCount: 0,
  couponCode: null,
  couponDiscount: 0,
  couponType: null,
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addItem: ({ id, name, price, quantity = 1, image_url, local_image }) => {
    set((state) => {
      const existing = state.items[id];
      const newQty = (existing?.quantity ?? 0) + quantity;

      const newItems = {
        ...state.items,
        [id]: { id, name, price, quantity: newQty, image_url, local_image },
      };

      const newQuantities = {
        ...state.quantities,
        [id]: newQty,
      };

      return {
        items: newItems,
        quantities: newQuantities,
        totalCount: state.totalCount + quantity,
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const existing = state.items[id];
      if (!existing) return state;

      const { [id]: _, ...remainingItems } = state.items;
      const { [id]: __, ...remainingQuantities } = state.quantities;

      return {
        items: remainingItems,
        quantities: remainingQuantities,
        totalCount: state.totalCount - existing.quantity,
      };
    });
  },

  updateQuantity: (id, qty) => {
    set((state) => {
      const existing = state.items[id];
      if (!existing) return state;

      if (qty <= 0) {
        // If updating to 0 or less, remove item
        const { [id]: _, ...remainingItems } = state.items;
        const { [id]: __, ...remainingQuantities } = state.quantities;
        return {
          items: remainingItems,
          quantities: remainingQuantities,
          totalCount: state.totalCount - existing.quantity,
        };
      }

      const diff = qty - existing.quantity;
      return {
        items: {
          ...state.items,
          [id]: { ...existing, quantity: qty },
        },
        quantities: {
          ...state.quantities,
          [id]: qty,
        },
        totalCount: state.totalCount + diff,
      };
    });
  },

  applyCoupon: (code) => {
    console.log('[Cart] Applying coupon:', code);
    if (code.toUpperCase() === 'SALE20') {
      set({ couponCode: 'SALE20', couponDiscount: 20, couponType: 'percent' });
    } else if (code.toUpperCase() === 'KIDDO100') {
      set({ couponCode: 'KIDDO100', couponDiscount: 100, couponType: 'flat' });
    } else {
      // Default fallback coupon
      set({ couponCode: code, couponDiscount: 10, couponType: 'percent' });
    }
  },

  applyMysteryGift: (code) => {
    console.log('[Cart] Applying mystery gift:', code);
    // Mystery gift coupon sets 35% discount
    set({ couponCode: `MYSTERY: ${code}`, couponDiscount: 35, couponType: 'percent' });
  },

  clearCart: () => {
    set({
      items: {},
      quantities: {},
      totalCount: 0,
      couponCode: null,
      couponDiscount: 0,
      couponType: null,
    });
  },
}));

// Selector hook — Components use this to subscribe to slices
export const useCart = cartStore;
