import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "../config/firebase";
const initialUserState = {
  name: "",
  email: "",
  contact: "",
  role: "",
  isLoading: "",
};

export const signUp = createAsyncThunk("content/signup", async (data) => {
  const { name, email, contact, password, userType } = data;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully");
    await setDoc(doc(firestore, "roles", email), {
      email: email,
      role: userType,
    });
    if (userType === "regular") {
      const docRef = await setDoc(doc(firestore, "users", email), {
        name: name,
        email: email,
        date: new Date().toDateString(),
      });
      console.log(docRef.id);
    } else if (userType === "shopOwner") {
      const docRef = await setDoc(doc(firestore, "shopOwners", email), {
        shopname: name,
        email: email,
        contact: contact,
        date: new Date().toDateString(),
      });
      console.log(docRef.id);
    }
    return [name, email, contact];
  } catch (error) {
    console.log(error);
  }
});

export const signIn = createAsyncThunk("content/signIn", async (data) => {
  const { email, password } = data;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // const res = await getDoc(doc(firestore, "roles", email));
    console.log("User Logged In");
    // return res.data().role;
  } catch (error) {
    console.log(error);
  }
});

export const logout = createAsyncThunk("content/logout", async () => {
  await signOut(auth);
  console.log("User logged out");
});

export const getUserData = createAsyncThunk(
  "content/getUserData",
  async (data) => {
    const { email, colname } = data;
    const res = await getDoc(doc(firestore, colname, email));
    const resData = res.data();
    console.log(resData);
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
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isLoading = false;
      // state.name = action.payload[0];
      // state.email = action.payload[1];
      // state.contact = action.payload[2];
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
      // state.error = action.error.message;
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
