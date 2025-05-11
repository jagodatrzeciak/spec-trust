import {createSlice} from "@reduxjs/toolkit";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const API_BASE = import.meta.env.VITE_API_URL;
let currentAbortController = null;
let lastRequestId = 0;

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
            statistic: null,
            p: null
        },
        isLoading: false,
        isShowingModal: false
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
        setFileName: (state, action) => {
            state.fileName = action.payload.fileName
        },
        setError: (state, action) => {
            state.error = action.payload.error;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setIsShowingModal: (state, action) => {
            state.isShowingModal = action.payload
        }
    },
});

export const analyzeCSV = ({ fileName, headers, data }) => async dispatch => {
    const requestId = ++lastRequestId;

    if (currentAbortController) {
        currentAbortController.abort();
    }

    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    dispatch(setLoading(true));

    try {
        const formattedHeaders = headers.map(h => h.replace(" ", "_").toLowerCase());

        const response = await fetch(API_BASE + "analyze/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ headers: formattedHeaders, data }),
            signal
        });

        const result = await response.json();

        if (requestId !== lastRequestId) return;

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
        if (error.name === "AbortError") return;

        if (requestId === lastRequestId) {
            dispatch(setError(error.toString()));
        }
    } finally {
        if (requestId === lastRequestId) {
            dispatch(setLoading(false));
        }
    }
};


export const createZip = () => async (dispatch, getState) => {
    try {
        const { csv } = getState();
        const zip = new JSZip();

        const csvContent = generateCSV(csv.headers, csv.data, csv.delta, csv.deltaSe);
        zip.file("data.csv", csvContent);

        const resultsContent = generateMethodResults(csv.sd.mean, csv.sd.uncertainty, csv.inverseSigma.mean, csv.inverseSigma.uncertainty, csv.mc.mean, csv.mc.uncertainty, csv.shapiro.statistic, csv.shapiro.p)
        zip.file("results.txt", resultsContent);

        const scatterPngBlob = await fetch(`${import.meta.env.VITE_MEDIA_URL}scatter_plot.png`).then(res => res.blob());
        const scatterPdfBlob = await fetch(`${import.meta.env.VITE_MEDIA_URL}scatter_plot.pdf`).then(res => res.blob());
        const violinPngBlob = await fetch(`${import.meta.env.VITE_MEDIA_URL}violin_plot.png`).then(res => res.blob());
        const violinPdfBlob = await fetch(`${import.meta.env.VITE_MEDIA_URL}violin_plot.pdf`).then(res => res.blob());

        zip.file("scatter_plot_example.png", scatterPngBlob);
        zip.file("scatter_plot.pdf", scatterPdfBlob);
        zip.file("violin_plot.png", violinPngBlob);
        zip.file("violin_plot.pdf", violinPdfBlob);

        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, "-")
        const filename = `spectrust_results_${timestamp}.zip`

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, filename);

    } catch (error) {
        console.error("Error creating ZIP:", error);
    }
};

function generateCSV(headers, data, delta, deltaSe) {
    let csv = "";

    csv += headers.join(",") + ",delta,se_delta\n";

    for (let i = 0; i < data[0].length; i++) {
        let row = data.map(col => col[i] || "").join(",");
        row += `,${delta[i] ?? ""},${deltaSe[i] ?? ""}\n`;
        csv += row;
    }

    return csv;
}

function generateMethodResults(sdMean, sd, inverseSigmaMean, inverseSigma, mcMean, mc, shapiroStatistic, shapiroPValue) {
    console.log(shapiroStatistic)
    let result = `SD Results\nMean: ${sdMean}\nUncertainty: ${sd}\n\nInverse Sigma Results\nMean: ${inverseSigmaMean}\nUncertainty: ${inverseSigma}\n\nMC Results\nMean: ${mcMean}\nUncertainty: ${mc}\n\nShapiro-Wilk Test Results\nStatistic: ${shapiroStatistic}\nP-value: ${shapiroPValue}`

    return result
}

export const { setCSVData, setFileName, setError, setLoading, setIsShowingModal } = csvSlice.actions;
export default csvSlice.reducer;