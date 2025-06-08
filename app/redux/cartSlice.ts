import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CartState {
  [id: string]: number; // dictionary type
}
const initialState: CartState | null = {};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addBulkCart(state, action: PayloadAction<CartState>) {
      return action.payload;
    },
    addToCart(state, action: PayloadAction<[string, number]>) {
      const [id, qty] = action.payload;
      state[id] = qty;
    },
    updateQty(state, action: PayloadAction<[string, number]>) {
      const [id, qty] = action.payload;
      state[id] = state[id] + qty;
    },

    deleteItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state[id];
    },
  },
});

export const { addToCart, addBulkCart, updateQty, deleteItem } = cartSlice.actions;
export default cartSlice.reducer;
