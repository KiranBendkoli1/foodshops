import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { firestore } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
const initialUserState = {
  name: "",
  email: "",
  contact: "",
  isLoading:"",
};

export const getUserData = createAsyncThunk(
  "content/getUserData",
  async (data) => {
    const { email, colname } = data;
    const res = await getDoc(doc(firestore, colname, email));
    const resData = res.data();
    console.log(resData)
    return [resData.shopname, resData.email, resData.contact];
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setContact(state, action) {
      state.contact = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.name = action.payload[0];
      state.email = action.payload[1];
      state.contact = action.payload[2];
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
