import { useDispatch } from "react-redux";
import {setCSVData, setError} from "../redux/csvSlice.js";
import {useEffect, useState} from "react";
import Spreadsheet from "react-spreadsheet";

export default function SpreadsheetComponent() {
    const dispatch = useDispatch();
    const requiredColumns = ["Standard1 Ratio", "Standard1 SE", "Sample Ratio", "Sample SE", "Standard2 Ratio", "Standard2 SE"];

    const [ data, setData ] = useState(
        Array(5).fill(requiredColumns.map(() => ({value: ""})))
    )

    const validateAndSave = () => {
        const cleaned = data.filter(row => row.some(cell => cell?.value?.toString().trim() !== ""))
        const columnData = requiredColumns.map((_, colIndex) => cleaned.map(row => row[colIndex]?.value?.trim() || "").filter(value => value !== ""))
        const columnLengths = columnData.map(col => col.length)
        const allEqual = columnLengths.every(len => len === columnLengths[0])

        if (!allEqual) {
            dispatch(setError({error: "Error: Columns have inconsistent row lengths!"}))
            return;
        }

        dispatch(setError({ error: "" }))
        dispatch(setCSVData({
            fileName: "manual_input",
            headers: requiredColumns,
            data: columnData
        }));
    }

    useEffect(() => {
        validateAndSave();
    }, [data]);

    return (
        <div>
            <Spreadsheet data={data} onChange={setData} columnLabels={requiredColumns}/>
        </div>
    );
}
