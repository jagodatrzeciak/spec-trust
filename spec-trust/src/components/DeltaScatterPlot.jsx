import React from "react";
import { useSelector } from "react-redux";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ErrorBar, Legend
} from "recharts";

export default function DeltaScatterPlot() {
    const { fileName, delta, deltaSe, sd, inverseSigma, sdMean, inverseSigmaMean, mc, mcMean } = useSelector((state) => state.csv);

    const chartData = [
        ...delta.map((value, index) => ({
            x: index + 1,
            y: value,
            error: deltaSe[index] || 0,
            label: "Subsequent measurements",
            color: "#393939",
        })),
        {
            x: delta.length + 1,
            y: sdMean,
            error: sd,
            label: "SD",
            color: "#6ca6cd",
        },
        {
            x: delta.length + 2,
            y: inverseSigmaMean,
            error: inverseSigma,
            label: "Inverse Sigma",
            color: "#ad7f97",
        },
        {
            x: delta.length + 3,
            y: mcMean,
            error: mc,
            label: "MC",
            color: "#ff4c4c",
        }
    ];

    const deltaPoints = chartData.filter((point) => point.label === "Subsequent measurements");
    const sdPoint = chartData.filter((point) => point.label === "SD");
    const inverseSigmaPoint = chartData.filter((point) => point.label === "Inverse Sigma");
    const mcPoint = chartData.filter((point) => point.label === "MC");

    const customLegendItems = chartData
        .filter((d) => d.label === "SD" || d.label === "Inverse Sigma" || d.label === "MC")
        .map((d) => ({
            value: d.label,
            type: "circle",
            color: d.color,
        }));

    return (
        <div className="mt-4 col-8 mb-1">
            <h5 className="text-center">{fileName !== "manual_input" ? fileName : ""}</h5>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 4" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={[0.5, chartData.length + 0.5]}
                        interval={0}
                        ticks={Array.from({ length: chartData.length }, (_, i) => i + 1)}                        name="subsequent measurements"
                        label={{ value: "subsequent measurements", position: "insideBottom", dy: 10 }}
                    />
                    <YAxis
                        dataKey="y"
                        name="δ ± SE_δ"
                        label={{ value: "δ ± SE_δ", angle: -90, position: "insideLeft", dy: -10 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend
                        content={() => (
                            <ul style={{ display: "flex", gap: "1rem", paddingLeft: 20 }}>
                                {customLegendItems.map((item, index) => (
                                    <li key={index} style={{ listStyle: "none", display: "flex", alignItems: "center", gap: 5 }}>
                                        <div style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            backgroundColor: item.color,
                                        }} />
                                        <span>{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    />

                    <Scatter name="Delta" data={deltaPoints} fill="#393939">
                        <ErrorBar dataKey="error" width={4} stroke="#393939" />
                    </Scatter>

                    <Scatter name="SD" data={sdPoint} fill="#6ca6cd">
                        <ErrorBar dataKey="error" width={4} stroke="#6ca6cd" />
                    </Scatter>

                    <Scatter name="Inverse Sigma" data={inverseSigmaPoint} fill="#ad7f97">
                        <ErrorBar dataKey="error" width={4} stroke="#ad7f97" />
                    </Scatter>

                    <Scatter name="MC" data={mcPoint} fill="#ff4c4c">
                        <ErrorBar dataKey="error" width={4} stroke="#ff4c4c" />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
