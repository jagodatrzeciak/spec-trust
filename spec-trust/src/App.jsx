import './App.css'
import Navbar from "./components/Navbar.jsx";
import CSVTable from "./components/CSVTable.jsx";
import {useSelector} from "react-redux";
import DeltaScatterPlot from "./components/DeltaScatterPlot.jsx";
import SpreadsheetComponent from "./components/SpreadsheetComponent.jsx";
import CSVUploader from "./components/CSVUplader.jsx";
import {useState} from "react";

function App() {
    const error = useSelector((state) => state.csv.error)
    const isDarkMode = useSelector((state) => state.mode.isDarkMode)
    const [ activeTab, setActiveTab ] = useState("upload")
    const { headers, data, delta, deltaSe } = useSelector((state) => state.csv)

    return (
        <div>
            <div>
                <Navbar isDarkMode={isDarkMode}/>
            </div>
            <div className="ms-5 mt-3">
                <h4 className="ms-1">Upload CSV file or enter the data manually.</h4>
                <p className="ms-1 mb-3">
                    The uploaded CSV file should contain the following key columns:
                    <br/> • <span className={`px-2 rounded bg-secondary-subtle text-dark`}>spl_r</span>, <span
                    className={`px-2 rounded bg-secondary-subtle text-dark`}>std1_r</span>, <span
                    className={`px-2 rounded bg-secondary-subtle text-dark`}>std2_r</span> - isotope ratios of sample
                    and bracketing standards,
                    <br/> • <span className={`px-2 rounded bg-secondary-subtle text-dark`}>spl_se</span>, <span
                    className={`px-2 rounded bg-secondary-subtle text-dark`}>std1_se</span>, <span
                    className={`px-2 rounded bg-secondary-subtle text-dark`}>std2_se</span> - its standard errors.
                </p>

                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
                            onClick={() => setActiveTab("upload")}
                        >
                            CSV Upload
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
                            onClick={() => setActiveTab("manual")}
                        >
                            Manual Entry
                        </button>
                    </li>
                </ul>

                <div className="card p-4">
                    {activeTab === "upload" && <CSVUploader error={error} />}
                    {activeTab === "manual" && <SpreadsheetComponent />}
                </div>

                {error && <h6 className="text-danger mt-2">{error}</h6>}
            </div>
            <div className="ms-5 mt-3">
                {!error && data?.[0]?.length > 0 &&
                    <CSVTable headers={headers} data={data} delta={delta} deltaSe={deltaSe} isDarkMode={isDarkMode}/>}
            </div>
            <div className="ms-5 mt-3">
                {!error && <DeltaScatterPlot/>}
            </div>
        </div>
    )
}

export default App
