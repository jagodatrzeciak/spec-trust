import { useDispatch } from "react-redux";
import { setCSVData, setError } from "../redux/csvSlice.js";
import Papa from "papaparse";

export default function CSVUploader({error}) {
    const dispatch = useDispatch();
    const requiredColumns = ["spl_r", "std1_r", "std2_r", "spl_se", "std1_se", "std2_se"];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) {
            dispatch(setError({ error: "No file selected." }));
            return;
        }

        dispatch(setError({ error: "" }));

        Papa.parse(file, {
            complete: (result) => {
                if (result.data.length === 0) {
                    dispatch(setError({ error: "The CSV file is empty." }));
                    return;
                }

                const headers = result.data[0].map(header => header.trim());
                const rows = result.data.slice(1).filter(row => row.some(cell => cell.trim() !== ""));

                const missingColumns = requiredColumns.filter(col => !headers.includes(col));
                if (missingColumns.length > 0) {
                    dispatch(setError({ error: `Missing required columns: ${missingColumns.join(", ")}` }));
                    return;
                }

                const transposedData = headers.map((_, colIndex) =>
                    rows.map(row => row[colIndex]?.trim() || "")
                );

                const columnLengths = transposedData.map(col => col.length);
                const allEqual = columnLengths.every(len => len === columnLengths[0]);

                if (!allEqual) {
                    dispatch(setError({ error: "Error: Provided columns have inconsistent row numbers." }));
                    return;
                }

                dispatch(setCSVData({
                    fileName: file.name.split(".")[0],
                    headers,
                    data: transposedData,
                }));
            },
            skipEmptyLines: true,
        });
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                className="form-control bg-light"
                onChange={handleFileUpload}
            />
        </div>
    );
}
