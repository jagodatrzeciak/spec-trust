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
    const [ activeTab, setActiveTab ] = useState("manual")
    const { headers, data, delta, deltaSe, loading } = useSelector((state) => state.csv)

    return (
        <div>
            <div>
                <Navbar/>
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

                <div className="d-flex align-items-start gap-4 mt-3">
                    <div className="card p-4 col-8">
                        {activeTab === "manual" && <SpreadsheetComponent />}
                        {activeTab === "upload" && <CSVUploader />}
                    </div>

                    <div className="col-3">
                        <img
                            src="/spectrust_gif.gif"
                            alt="Cat GIF"
                            style={{ width: "100%"}}
                        />
                    </div>
                </div>

                {error && <h6 className="text-danger mt-2">{error}</h6>}
            </div>
            <div className="d-flex justify-content-center col-7 mt-3">
                <div className="d-flex gap-3">
                    <div><span className="legend-dot sd"></span> SD</div>
                    <div><span className="legend-dot inverse-sigma"></span> Inverse Sigma</div>
                    <div><span className="legend-dot mc"></span> MC</div>
                </div>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center mt-1 p-0">
                <div className="col-6 me-2">
                    {!error && <DeltaScatterPlot/>}
                </div>
                <div className="col-5 mt-1">
                    <p>The first method calculates the mean and sample <strong className="sd">standard deviation </strong>of the δ values. This is a measure of the uncertainty of δ without considering their individual errors.</p>
                    <p>The <strong className="inverse-sigma">Inverse-σ method</strong> uses the individual δ standard errors (SE<sub>δ</sub>) as weights to calculate weighted mean. Measurements with lower SE contribute more to the mean, while less precise measurements contribute less.</p>
                    <p>The <strong className="mc">MC method</strong> uses Monte Carlo simulations to estimate uncertainty. It generates thousands of noisy δ datasets by randomly adding measurement errors, computes the standard deviation of each, and averages them.</p>
                </div>
            </div>
            <div className="ms-5 mt-3 mb-5">
                {!error && data?.[0]?.length > 0 &&
                    <CSVTable headers={headers} data={data} delta={delta} deltaSe={deltaSe}/>}
            </div>
        </div>
    )
}

export default App
