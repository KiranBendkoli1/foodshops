import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { signInApi, signUpApi } from "../api/AuthAPI";
import { toast } from "react-toastify";
const initialUserState = {
  isLoading: "",
  user: {},
};

export const signUp = createAsyncThunk("content/signup", async (data) => {
  const { name, email, contact, password, userType } = data;
  const result = await signUpApi(name, email, contact, password, userType);
  if (result.data === null) return {};
  return result;
});

export const signIn = createAsyncThunk("content/signIn", async (data) => {
  const { email, password } = data;
  const result = await signInApi(email, password);
  return result;
});

export const logout = createAsyncThunk("content/logout", async () => {
  localStorage.removeItem("user");
  toast.success("User logged out successfully");
  return null;
});

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
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
