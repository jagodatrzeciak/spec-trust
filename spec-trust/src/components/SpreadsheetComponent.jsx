import { useDispatch } from "react-redux";
import {analyzeCSV, setError} from "../redux/csvSlice.js";
import {useEffect, useState} from "react";
import Spreadsheet from "react-spreadsheet";
import {datasets} from "../../datasets.js";

export default function SpreadsheetComponent() {
    const dispatch = useDispatch();
    const requiredColumns = ["Standard1 Ratio", "Standard1 SE", "Sample Ratio", "Sample SE", "Standard2 Ratio", "Standard2 SE"];
    const [ data, setData ] = useState(
        Array(5).fill(requiredColumns.map(() => ({value: ""})))
    )
    const [sampleName, setSampleName] = useState(null)

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
        dispatch(analyzeCSV({ fileName: sampleName ? sampleName : "manual_input", headers: requiredColumns, data: columnData }));
    }

    useEffect(() => {
        validateAndSave();
    }, [data]);

    function loadDataset(name) {
        setData(datasets[name])
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="sampleName" style={{ whiteSpace: 'nowrap' }}>Sample Name:</label>
                <input
                    id="sampleName"
                    type="text"
                    className="form-control"
                    style={{ width: '250px' }}
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                />
            </div>
            <Spreadsheet data={data} onChange={setData} columnLabels={requiredColumns} className="mt-2"/>
            <h6>Exemplary datasets:</h6>
            <div className="row col-10 ms-1">
                <button className="btn btn-secondary col-2 me-2" onClick={() => loadDataset("bc210a")}>BC210a</button>
                <button className="btn btn-secondary col-3 me-2" onClick={() => loadDataset("asw")}>ASW (selenium)
                </button>
                <button className="btn btn-secondary col-2" onClick={() => loadDataset("ume2")}>UME2</button>
            </div>
            <div className="mt-1">You can find more exemplary datasets <a
                href="https://drive.google.com/drive/folders/1DtlCLSTYBFxZo53G3e6bvQxm-fFPMsSm?usp=drive_link"
                target="_blank" rel="noopener noreferrer">here</a>.
            </div>
            <div>Dataset descriptions can be found in our <a
                href="https://github.com/jagodatrzeciak/spec-trust/blob/main/README.md" target="_blank"
                rel="noopener noreferrer">README</a> file.
            </div>
        </div>
    );
}
