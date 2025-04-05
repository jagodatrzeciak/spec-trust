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
    ErrorBar
} from "recharts";

export default function DeltaScatterPlot() {
    const { fileName, delta, deltaSe, sd, inverseSigma, mc } = useSelector((state) => state.csv);

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
            y: sd.mean,
            error: sd.uncertainty,
            label: "SD",
            color: "#6ca6cd",
        },
        {
            x: delta.length + 2,
            y: inverseSigma.mean,
            error: inverseSigma.uncertainty,
            label: "Inverse Sigma",
            color: "#ad7f97",
        },
        {
            x: delta.length + 3,
            y: mc.mean,
            error: mc.uncertainty,
            label: "MC",
            color: "#ff8f89",
        }
    ];

    const deltaPoints = chartData.filter((point) => point.label === "Subsequent measurements");
    const sdPoint = chartData.filter((point) => point.label === "SD");
    const inverseSigmaPoint = chartData.filter((point) => point.label === "Inverse Sigma");
    const mcPoint = chartData.filter((point) => point.label === "MC");

    return (
        <div className="mb-1">
            <h5 className="text-center">{fileName !== "manual_input" ? fileName : ""}</h5>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ bottom: 10, left: 10}}>
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
                        label={{ value: "δ ± SE_δ", angle: -90, position: "insideLeft", dy: 0, style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />

                    <Scatter name="Delta" data={deltaPoints} fill="#393939">
                        <ErrorBar dataKey="error" width={4} stroke="#393939" />
                    </Scatter>

                    <Scatter name="SD" data={sdPoint} fill="#6ca6cd">
                        <ErrorBar dataKey="error" width={4} stroke="#6ca6cd" />
                    </Scatter>

                    <Scatter name="Inverse Sigma" data={inverseSigmaPoint} fill="#ad7f97">
                        <ErrorBar dataKey="error" width={4} stroke="#ad7f97" />
                    </Scatter>

                    <Scatter name="MC" data={mcPoint} fill="#ff8f89">
                        <ErrorBar dataKey="error" width={4} stroke="#ff8f89" />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
