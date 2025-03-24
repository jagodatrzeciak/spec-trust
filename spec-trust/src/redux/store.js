import { configureStore } from "@reduxjs/toolkit";
import csvReducer from "./csvSlice";
import modeReducer from "./modeSlice"

export const store = configureStore({
    reducer: {
        csv: csvReducer,
        mode: modeReducer,
    },
});