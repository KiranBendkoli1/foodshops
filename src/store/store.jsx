import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import placesReducer from "./placesSlice";
import imageReducer from "./extraDataSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    places: placesReducer,
    extras: imageReducer
  },
});


export default store;