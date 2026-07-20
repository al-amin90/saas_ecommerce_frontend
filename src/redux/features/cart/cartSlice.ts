import { IColor } from "@/src/interface/dashboard/dashboard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number;
  discountPrice: number;
  colorId: { _id: string; name: string; color: string };
  size: string;
  quantity: number;
  stock: number;
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
          i.colorId._id === action.payload.colorId._id &&
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
      action: PayloadAction<{
        productId: string;
        colorId: IColor;
        size: string;
      }>,
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.colorId._id === action.payload.colorId._id &&
            i.size === action.payload.size
          ),
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        colorId: IColor;
        size: string;
        quantity: number;
      }>,
    ) {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.colorId._id === action.payload.colorId._id &&
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
  state.cart.items.reduce((sum, item) => {
    const price =
      item.price > (item.discountPrice || 0)
        ? Math.round(item.price - (item.discountPrice || 0))
        : item.price;

    return sum + price * item.quantity;
  }, 0);

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
