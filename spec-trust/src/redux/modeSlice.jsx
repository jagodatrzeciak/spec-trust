import { createSlice } from "@reduxjs/toolkit";

const modeSlice = createSlice({
    name: "mode",
    initialState: {
        isDarkMode: false
    },
    reducers: {
        setIsDarkMode: (state, action) => {
            state.isDarkMode = action.payload.isDarkMode;
        },
    },
});

export const { setIsDarkMode } = modeSlice.actions;
export default modeSlice.reducer;