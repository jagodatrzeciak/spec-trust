import './App.css'
import Navbar from "./components/Navbar.jsx";
import CSVUploader from "./components/CSVUplader.jsx";
import CSVTable from "./components/CSVTable.jsx";
import {useSelector} from "react-redux";
import DeltaScatterPlot from "./components/DeltaScatterPlot.jsx";

function App() {
    const error = useSelector((state) => state.csv.error)
    const isDarkMode = useSelector((state) => state.mode.isDarkMode)
    const fileName = useSelector((state) => state.csv.fileName)
    const { headers, data, delta, deltaSe } = useSelector((state) => state.csv)
    console.log(fileName)

    return (
        <div>
            <div>
                <Navbar isDarkMode={isDarkMode}/>
            </div>
            <div className="ms-5 mt-3">
                <CSVUploader error={error}/>
            </div>
            <div className="ms-5 mt-3">
                {!error && <CSVTable headers={headers} data={data} delta={delta} deltaSe={deltaSe} isDarkMode={isDarkMode}/>}
            </div>
            <div className="ms-5 mt-3">
                {!error && <DeltaScatterPlot/>}
            </div>
    </div>
  )
}

export default App
