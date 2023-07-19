import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
    name: "",
    email:"",
}

const userSlice = createSlice({
    name:"user",
    initialState: initialUserState,
    reducers:{
        setName(state, action){
            state.name = action.payload
        },
        setEmail(state, action){
            state.email = action.payload;
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;