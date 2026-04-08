import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabase";

const initialUserState = {
  name: "",
  email: "",
  contact: "",
  role: "",
  isLoading: "",
};

export const signUp = createAsyncThunk("content/signup", async (data) => {
  const { name, shopName, email, contact, password, userType } = data;
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (authError) throw authError;


    const { error } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        email: email,
        name: name,
        shopname: userType === "shopOwner" ? shopName : null,
        contact: userType === "shopOwner" ? contact : null,
        role: userType,
      },
    ]);
    if (error) {
      console.error("Profile insert error", error);
      throw error;
    }
    
    const finalName = userType === "shopOwner" ? shopName : name;
    return [finalName, email, contact];
  } catch (error) {
  }
});

export const signIn = createAsyncThunk("content/signIn", async (data) => {
  const { email, password } = data;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;
  } catch (error) {
  }
});

export const logout = createAsyncThunk("content/logout", async () => {
  await supabase.auth.signOut();
});

export const getUserData = createAsyncThunk(
  "content/getUserData",
  async (data) => {
    const { email } = data;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
      
    if (error) throw error;
    const shopName = profile.shopname || profile.name;
    return [shopName, profile.email, profile.contact];
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
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.name = action.payload[0];
        state.email = action.payload[1];
        state.contact = action.payload[2];
      }
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error?.message;
    });
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      // state.role = action.payload;
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
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
