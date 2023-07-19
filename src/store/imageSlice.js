import { createSlice } from "@reduxjs/toolkit";

const initialImageState = {
    image: "",
}

const imageSlice = createSlice({
    name:"image",
    initialState: initialImageState,
    reducers:{
        setImage(state, action){
            state.image = action.payload
        },
    }
});

export const imageActions = imageSlice.actions;
export default imageSlice.reducer;