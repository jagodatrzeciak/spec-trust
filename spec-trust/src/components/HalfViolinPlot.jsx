// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";
// import { useSelector } from "react-redux";
//
// function generateNormalSamples(mean, std, n = 1000) {
//     return Array.from({ length: n }, () => {
//         const u1 = Math.random();
//         const u2 = Math.random();
//         return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
//     });
// }
//
// export default function HalfViolinPlot() {
//     const { delta, deltaSe, sd, inverseSigma, sdMean, inverseSigmaMean, mc, mcMean } =
//         useSelector((state) => state.csv);
//
//     const [plotData, setPlotData] = useState([]);
//
//     useEffect(() => {
//         if (!delta || delta.length === 0) return;
//
//         const violins = delta.map((d, i) => {
//             const samples = generateNormalSamples(d, deltaSe[i], 1000);
//             return {
//                 type: "violin",
//                 y: samples,
//                 x: samples.map(() => i + 1),
//                 side: "positive",
//                 line: { color: "black" },
//                 fillcolor: "rgba(100,100,200,0.6)",
//                 points: false,
//                 meanline: { visible: true },
//                 showlegend: false,
//             };
//         });
//
//         const uncertaintyPoints = [
//             {
//                 label: "SD",
//                 delta: sdMean,
//                 se: sd,
//             },
//             {
//                 label: "Inverse-Sigma",
//                 delta: inverseSigmaMean,
//                 se: inverseSigma,
//             },
//             {
//                 label: "MC",
//                 delta: mcMean,
//                 se: mc,
//             },
//         ];
//
//         const uncertaintyTraces = uncertaintyPoints.map((u, index) => ({
//             type: "scatter",
//             x: [delta.length + index + 1],
//             y: [u.delta],
//             error_y: {
//                 type: "data",
//                 array: [u.se],
//                 visible: true,
//             },
//             mode: "markers+text",
//             marker: { color: "red", size: 8 },
//             text: u.label,
//             textposition: "top center",
//             showlegend: false,
//         }));
//
//         setPlotData([...violins, ...uncertaintyTraces]);
//     }, [delta, deltaSe, sd, inverseSigma, sdMean, inverseSigmaMean, mc, mcMean]);
//
//     return (
//         <Plot
//             data={plotData}
//             layout={{
//                 title: "Measurement Uncertainty (Half Violin Plots)",
//                 xaxis: { title: "Measurement Index", dtick: 1 },
//                 yaxis: { title: "δ ± SE(δ)" },
//                 violingap: 0.3,
//                 height: 600,
//             }}
//             style={{ width: "100%" }}
//         />
//     );
// }
