import './App.css'
import Navbar from "./components/Navbar.jsx";
import CSVTable from "./components/CSVTable.jsx";
import {useSelector} from "react-redux";
import DeltaScatterPlot from "./components/DeltaScatterPlot.jsx";
import SpreadsheetComponent from "./components/SpreadsheetComponent.jsx";
import CSVUploader from "./components/CSVUplader.jsx";
import {useState} from "react";
import HalfViolinPlot from "./components/HalfViolinPlot.jsx";


function App() {
    const error = useSelector((state) => state.csv.error)
    const isDarkMode = useSelector((state) => state.mode.isDarkMode)
    const [ activeTab, setActiveTab ] = useState("manual")
    const { headers, data, delta, deltaSe, loading } = useSelector((state) => state.csv)

    return (
        <div>
            <div>
                <Navbar isDarkMode={isDarkMode}/>
            </div>
            <div className="ms-5 mt-3">
                <h4 className="ms-1">Upload CSV file or enter the data manually.</h4>
                <ul className="nav nav-tabs col-7">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
                            onClick={() => setActiveTab("manual")}
                        >
                            Manual Entry
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
                            onClick={() => setActiveTab("upload")}
                        >
                            CSV Upload
                        </button>
                    </li>
                </ul>

                <div className="card p-4 col-8">
                    {activeTab === "manual" && <SpreadsheetComponent/>}
                    {activeTab === "upload" && <CSVUploader/>}
                </div>

                {error && <h6 className="text-danger mt-2">{error}</h6>}
            </div>
            <div className="ms-5 mt-3">
                {!error && data?.[0]?.length > 0 &&
                    <CSVTable headers={headers} data={data} delta={delta} deltaSe={deltaSe} isDarkMode={isDarkMode}/>}
            </div>
            <div className="ms-5">
                {/*{!error && <HalfViolinPlot/>}*/}
                {!error && <DeltaScatterPlot/>}
                <div className="col-8 mb-5">
                    <p>The <strong className="sd">SD method</strong> calculates the mean and sample standard deviation of the δ values. This is a measure of the uncertainty of δ without considering their individual errors.</p>
                    <p>The <strong className="inverse-sigma">Inverse-σ method</strong> uses the individual δ standard errors (SE_δ) as weights to calculate weighted mean. Measurements with lower SE contribute more to the mean, while less precise measurements contribute less.</p>
                    <p>The <strong className="mc">MC method</strong> uses Monte Carlo simulations to estimate uncertainty. It generates thousands of noisy δ datasets by randomly adding measurement errors, computes the standard deviation of each, and averages them.</p>
                </div>
        </div>
        </div>
    )
}

export default App
