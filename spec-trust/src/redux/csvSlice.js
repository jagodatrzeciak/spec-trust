import { createSlice } from "@reduxjs/toolkit";

const csvSlice = createSlice({
    name: "csv",
    initialState: {
        fileName: null,
        headers: [],
        data: [],
        delta: [],
        deltaSe: [],
        error: null,
        sd: null,
        sdMean: null,
        mc: null,
        mcMean: null,
        inverseSigma: null,
        inverseSigmaMean: null,
    },
    reducers: {
        setCSVData: (state, action) => {
            state.fileName = action.payload.fileName
            state.headers = action.payload.headers;
            state.data = action.payload.data;

            const spl_r_index = state.headers.indexOf("sample_ratio");
            const std1_r_index = state.headers.indexOf("standard1_ratio");
            const std2_r_index = state.headers.indexOf("standard2_ratio");
            const spl_se_index = state.headers.indexOf("sample_se");
            const std1_se_index = state.headers.indexOf("standard1_se");
            const std2_se_index = state.headers.indexOf("standard2_se");

            state.delta = state.data[spl_r_index].map((spl_r_value, rowIndex) => {
                const std1_value = parseFloat(state.data[std1_r_index][rowIndex]) || 0;
                const std2_value = parseFloat(state.data[std2_r_index][rowIndex]) || 0;
                const spl_value = parseFloat(spl_r_value) || 0;

                return 1000 * (2 * spl_value / (std1_value + std2_value) - 1);
            });

            state.deltaSe = state.data[spl_r_index].map((spl_r_value, rowIndex) => {
                const std1_value = parseFloat(state.data[std1_r_index][rowIndex]) || 0;
                const std2_value = parseFloat(state.data[std2_r_index][rowIndex]) || 0;
                const spl_value = parseFloat(spl_r_value) || 0;

                const spl_se_value = parseFloat(state.data[spl_se_index][rowIndex]) || 0;
                const std1_se_value = parseFloat(state.data[std1_se_index][rowIndex]) || 0;
                const std2_se_value = parseFloat(state.data[std2_se_index][rowIndex]) || 0;

                const f_abs = (2 * spl_value) / (std1_value + std2_value);
                const f_spl = spl_value === 0 ? 0 : spl_se_value / spl_value;
                const f_std =
                    Math.sqrt(std1_se_value ** 2 + std2_se_value ** 2) /
                    (std1_value + std2_value);

                return 1000 * Math.abs(f_abs) * Math.sqrt(f_spl ** 2 + f_std ** 2);
            });

            // sd
            state.sdMean = state.delta.reduce((a, b) => a + b, 0) / state.delta.length
            state.sd = Math.sqrt(state.delta.reduce((sum, val) => sum + Math.pow(val - state.sdMean, 2), 0) / (state.delta.length - 1))

            // inverse sigma
            const wi = state.deltaSe.map(v => 1 / v)
            state.inverseSigma = Math.sqrt(1 / wi.reduce((sum, w) => sum + w, 0))
            state.inverseSigmaMean = state.delta.reduce((sum, val, i) => sum + val * wi[i], 0) / wi.reduce((sum, w) => sum + w, 0)

            // mc
            const n = 10000
            const meanDelta = state.delta.reduce((a, b) => a + b, 0) / state.delta.length

            const simulations = []
            for (let i = 0; i < n; i++) {
                const noise = state.deltaSe.map(se => randomNormal(0, se));
                const simulated = state.delta.map((val, idx) => val + noise[idx] - meanDelta);
                const sd = standardDeviation(simulated);
                simulations.push(sd);
            }

            state.mc = simulations.reduce((a, b) => a + b, 0) / n
            state.mcMean = meanDelta
        },
        setError: (state, action) => {
            state.error = action.payload.error;
        }
    },
});

function randomNormal(mean = 0, std = 1) {
    const u1 = Math.random();
    const u2 = Math.random();

    return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function standardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const sqDiffs = arr.map(x => (x - mean) ** 2);
    const avgSqDiff = sqDiffs.reduce((a, b) => a + b, 0) / arr.length;

    return Math.sqrt(avgSqDiff);
}

export const { setCSVData, setError } = csvSlice.actions;
export default csvSlice.reducer;