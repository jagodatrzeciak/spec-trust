import './App.css'
import Navbar from "./components/Navbar.jsx";
import CSVTable from "./components/CSVTable.jsx";
import {useSelector} from "react-redux";
import DeltaScatterPlot from "./components/DeltaScatterPlot.jsx";
import SpreadsheetComponent from "./components/SpreadsheetComponent.jsx";
import CSVUploader from "./components/CSVUploader.jsx";
import React, {useState} from "react";
import ShapiroResult from "./components/ShapiroResult.jsx";
import {ClipLoader} from "react-spinners";
import ReadmeModal from "./components/ReadmeModal.jsx";


function App() {
    const error = useSelector((state) => state.csv.error)
    const [ activeTab, setActiveTab ] = useState("manual")
    const { fileName, headers, data, delta, deltaSe, sd, inverseSigma, mc, isLoading, isShowingModal } = useSelector((state) => state.csv)

    return (
        <div>
            <div>
                <Navbar isShowingModal={isShowingModal}/>
            </div>
            {isShowingModal && <ReadmeModal isShowingModal={isShowingModal}/>}
            <div className="ms-5 mt-3">
                <h4 className="ms-1">Upload CSV file or enter the data manually.</h4>
                <ul className="nav nav-tabs col-8">
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
                        <div className="col-10">
                            {activeTab === "manual" && <SpreadsheetComponent />}
                            {activeTab === "upload" && <CSVUploader />}
                        </div>
                    </div>
                </div>

                {error && <h6 className="text-danger mt-2">{error}</h6>}
            </div>
            {isLoading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "150px" }}
                >
                    <ClipLoader color="#ff8f89" size={80} />
                </div>
            ) : (
                <div>
                    <div className="d-flex flex-row align-items-center justify-content-center mt-1 p-0">
                        <div className="col-6 me-3">
                            {!error && <DeltaScatterPlot/>}
                        </div>
                        <div className="col-5">
                            <p>The first method calculates the mean and sample <strong className="sd">standard deviation </strong>of the δ values. This is a measure of the uncertainty of δ without considering their individual errors.</p>
                            <p>The <strong className="inverse-sigma">Inverse-σ method</strong> uses the individual δ standard errors (SE<sub>δ</sub>) as weights to calculate weighted mean. Measurements with lower SE contribute more to the mean, while less precise measurements contribute less.</p>
                            <p>The <strong className="mc">MC method</strong> uses Monte Carlo simulations to estimate uncertainty. It generates thousands of noisy δ datasets by randomly adding measurement errors, computes the standard deviation of each, and averages them.</p>
                        </div>
                    </div>
                    {!error && <div className="row mt-3 ms-5 col-11">
                        <div className="col-6">
                            <ShapiroResult />
                        </div>
                        <div className="col-6 mt-2 d-flex justify-content-center align-items-center">
                            {delta.length === 0 ? null : <div>
                                <h5 className="text-center">{fileName !== "manual_input" ? fileName : ""}</h5>
                                <img
                                src={`${import.meta.env.VITE_MEDIA_URL}violin_plot.png`}
                                alt="Half Violin Plot"
                                className="img-fluid"
                                style={{ maxHeight: "300px" }}
                                />
                            </div>}
                        </div>
                    </div>}
                    {!error && delta?.length > 0 && <div className="row mt-3 ms-5 col-11 me-1">
                        <div className="col-4">
                            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
                                <h3 className="sd">SD Results</h3>
                                <p><strong>Mean:</strong> {sd.mean?.toFixed(4)}</p>
                                <p><strong>Uncertainty:</strong> {sd.uncertainty?.toFixed(4)}</p>
                            </div>
                        </div>
                        <div className="col-4">
                            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
                                <h3 className="inverse-sigma">Inverse Sigma Results</h3>
                                <p><strong>Mean:</strong> {inverseSigma.mean?.toFixed(4)}</p>
                                <p><strong>Uncertainty:</strong> {inverseSigma.uncertainty?.toFixed(4)}</p>
                            </div>
                        </div>
                        <div className="col-4">
                            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
                                <h3 className="mc">MC Results</h3>
                                <p><strong>Mean:</strong> {mc.mean?.toFixed(4)}</p>
                                <p><strong>Uncertainty:</strong> {mc.uncertainty?.toFixed(4)}</p>
                            </div>
                        </div>
                    </div>}
                    <div className="p-1 ms-5 me-2 mt-3 col-11">
                        {!error && data?.[0]?.length > 0 &&
                            <CSVTable headers={headers} data={data} delta={delta} deltaSe={deltaSe}/>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
