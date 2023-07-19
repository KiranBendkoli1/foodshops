import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import placesReducer from "./placesSlice";
import imageReducer from "./imageSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    places: placesReducer,
    image: imageReducer
  },
});


export default store;