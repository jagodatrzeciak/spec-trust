import React from "react";
import { useSelector } from "react-redux";
import {
    ScatterChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function DeltaScatterPlot() {
    const { fileName, delta } = useSelector((state) => state.csv);

    return (
        <div className="mb-1">
            {delta.length === 0 ? <div>
                <div className="d-flex flex-row align-items-center justify-content-center p-0">
                    <div className="d-flex justify-content-center col-7">
                        <div className="d-flex gap-3">
                            <div><span className="legend-dot sd"></span> SD</div>
                            <div><span className="legend-dot inverse-sigma"></span> Inverse Sigma</div>
                            <div><span className="legend-dot mc"></span> MC</div>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ bottom: 10, left: 10}}>
                        <CartesianGrid strokeDasharray="3 4" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[0, 8]}
                            interval={0}
                            name="subsequent measurements"
                            label={{ value: "subsequent measurements", position: "insideBottom", dy: 10 }}
                        />
                        <YAxis
                            dataKey="y"
                            name="δ ± SE_δ"
                            label={{ value: "δ ± SE_δ", angle: -90, position: "insideLeft", dy: 0, style: { textAnchor: 'middle' } }}
                        />
                        <text
                            x="55%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#888"
                            fontSize="30"
                        >
                            Provide data
                        </text>
                    </ScatterChart>
                </ResponsiveContainer>
            </div> : <div className="mt-4">
                <h5 className="text-center">{fileName !== "manual_input" ? fileName : ""}</h5>
                <img src={`${import.meta.env.VITE_MEDIA_URL}scatter_plot.png`}
                    alt="Scatter Plot"
                    className="img-fluid"
                    style={{ width: "100%", maxHeight: "330px" }}
                />
                </div>}
        </div>
    );
}
