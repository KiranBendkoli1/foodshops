import { createSlice } from "@reduxjs/toolkit";

const initialDataState = {
  image: "",
  item: "",
  discount: "",
};

const extraDataSlice = createSlice({
  name: "extras",
  initialState: initialDataState,
  reducers: {
    setImage(state, action) {
      state.image = action.payload;
    },
    setItem(state, action) {
      state.item = action.payload;
    },
    setDiscount(state, action) {
      state.discount = action.payload;
    },
  },
});

export const extraDataActions = extraDataSlice.actions;
export default extraDataSlice.reducer;
