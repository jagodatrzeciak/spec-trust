import {createSlice} from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;

const csvSlice = createSlice({
    name: "csv",
    initialState: {
        fileName: null,
        headers: [],
        data: [],
        delta: [],
        deltaSe: [],
        error: null,
        sd: {
            mean: null,
            uncertainty: null
        },
        inverseSigma: {
            mean: null,
            uncertainty: null
        },
        mc: {
            mean: null,
            uncertainty: null
        },
        shapiro: {
            static: null,
            p: null
        },
        isLoading: false
    },
    reducers: {
        setCSVData: (state, action) => {
            state.fileName = action.payload.fileName;
            state.headers = action.payload.headers;
            state.data = action.payload.data;
            state.delta = action.payload.delta;
            state.deltaSe = action.payload.deltaSe;
            state.sd = action.payload.sd;
            state.mc = action.payload.mc;
            state.inverseSigma = action.payload.inverseSigma;
            state.shapiro = action.payload.shapiro;
        },
        setError: (state, action) => {
            state.error = action.payload.error;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const analyzeCSV = ({ fileName, headers, data }) => async dispatch => {
    try {
        dispatch(setLoading(true));
        const formattedHeaders = headers.map(h => h.replace(" ", "_").toLowerCase());

        const response = await fetch(API_BASE + "analyze/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                headers: formattedHeaders,
                data
            })
        });

        const result = await response.json();

        if (result.error) {
            dispatch(setError(result.error));
        } else {
            dispatch(setCSVData({
                fileName,
                headers: formattedHeaders,
                data,
                ...result
            }));
        }
    } catch (error) {
        dispatch(setError(error.toString()));
    } finally {
        dispatch(setLoading(false));
    }
};

export const { setCSVData, setError, setLoading } = csvSlice.actions;
export default csvSlice.reducer;