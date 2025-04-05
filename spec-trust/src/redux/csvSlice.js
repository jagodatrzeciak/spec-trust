import {createSlice} from "@reduxjs/toolkit";

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
        }
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
        }
    },
});

export const analyzeCSV = ({ fileName, headers, data }) => async dispatch => {
    try {
        const formattedHeaders = headers.map(h => h.replace(" ", "_").toLowerCase());

        const response = await fetch("http://127.0.0.1:8000/api/analyze/", {
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
    }
};

export const { setCSVData, setError } = csvSlice.actions;
export default csvSlice.reducer;