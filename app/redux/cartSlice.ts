import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CartState {
  id: string;
  qty: number;
}
const initialState: CartState[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartState>) {
      state.push(action.payload);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      const newCart = state.filter((item: { id: string }) => item.id !== action.payload);
      state = newCart;
    },

    increaseQty(state, action: PayloadAction<string>) {
      const item = state.find((item: { id: string }) => item.id === action.payload);
      if (item) {
        item.qty += 1;
      }
    },
    decreaseQty(state, action: PayloadAction<string>) {
      const item = state.find((item: { id: string }) => item.id === action.payload);
      if (item) {
        item.qty += 1;
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;
