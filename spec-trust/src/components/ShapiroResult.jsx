import React from "react";
import { useSelector } from "react-redux";

const ShapiroResult = () => {
    const shapiro = useSelector((state) => state.csv.shapiro);

    if (!shapiro.static && !shapiro.p) return null;

    const { statistic, p } = shapiro;
    const isNormal = p > 0.05;

    return (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
            <h3>Shapiro-Wilk Normality Test</h3>
            <p><strong>W statistic:</strong> {statistic.toFixed(4)}</p>
            <p><strong><i>p-value</i>:</strong> {p.toFixed(4)}</p>
            <p>
                <strong>Interpretation:</strong>{" "}
                {isNormal ? "✅ The spread between measurements appears to follow a normal distribution (p > 0.05)" : "❌ The spread between measurements deviates from a normal distribution (p ≤ 0.05)"}
            </p>
        </div>
    );
};

export default ShapiroResult;