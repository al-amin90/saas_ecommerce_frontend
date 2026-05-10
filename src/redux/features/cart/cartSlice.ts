import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  discountPrice: number;
  color: string; // color _id
  size: number;
  quantity: number;
  stock: number; // max available
}

interface CartState {
  items: ICartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size,
      );
      if (existing) {
        // stock limit check
        existing.quantity = Math.min(
          existing.quantity + action.payload.quantity,
          existing.stock,
        );
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; color: string; size: number }>,
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.color === action.payload.color &&
            i.size === action.payload.size
          ),
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        color: string;
        size: number;
        quantity: number;
      }>,
    ) {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size,
      );
      if (item) {
        item.quantity = Math.min(
          Math.max(1, action.payload.quantity),
          item.stock,
        );
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

// ── Selectors ──────────────────────────────────────────────────────────────

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0,
  );

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
