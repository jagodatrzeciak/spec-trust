import { useDispatch } from "react-redux";
import {analyzeCSV, setError, setFileName} from "../redux/csvSlice.js";
import {useEffect, useState} from "react";
import Spreadsheet from "react-spreadsheet";
import {datasets} from "../../datasets.js";


export default function SpreadsheetComponent() {
    const dispatch = useDispatch();
    const requiredColumns = ["Standard I", "Standard I SE", "Sample", "Sample SE", "Standard II", "Standard II SE"];
    const [isDisabled, setIsDisabled] = useState(false)
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
        dispatch(analyzeCSV({ fileName: sampleName ? sampleName : "manual_input", headers:         ['standard1_ratio', 'standard1_se', 'sample_ratio', 'sample_se', 'standard2_ratio', 'standard2_se'], data: columnData }));
    }

    useEffect(() => {
        validateAndSave();
    }, [data]);

    useEffect(() => {
        dispatch(setFileName({fileName: sampleName}))
    }, [sampleName]);

    function loadDataset(name) {
        setIsDisabled(true);
        setData(datasets[name])
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    }

    return (
        <div className="col-12">
            <div className="container p-2">
                <Spreadsheet
                    data={data}
                    onChange={setData}
                    columnLabels={requiredColumns}
                    className="mt-2"
                />
            </div>
            <div className="ms-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="sampleName" style={{ whiteSpace: 'nowrap' }}>Enter a name here if you'd like it to appear on the plot:</label>
                    <input
                        id="sampleName"
                        type="text"
                        className="form-control"
                        style={{ width: '250px' }}
                        value={sampleName}
                        onChange={(e) => setSampleName(e.target.value)}
                    />
                </div>
                <h6>Exemplary datasets:</h6>
                <div className="row col-11 ms-1">
                    <button className="btn btn-secondary col-2 me-2" disabled={isDisabled} onClick={() => loadDataset("bc210a")}>BC210a</button>
                    <button className="btn btn-secondary col-3 me-2" disabled={isDisabled} onClick={() => loadDataset("asw")}>ASW (selenium)
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
        </div>
    );
}
