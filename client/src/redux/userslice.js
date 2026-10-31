import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    userdata: null,
  },

  reducers: {
    setuserdata: (state, action) => {
      state.userdata = action.payload;
    },

    clearUserData: (state) => {
      state.userdata = null;
    },
  },
});

export const { setuserdata, clearUserData } = userSlice.actions;

export default userSlice.reducer;