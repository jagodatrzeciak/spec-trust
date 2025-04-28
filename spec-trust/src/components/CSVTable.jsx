import {useDispatch} from "react-redux";
import {createZip} from "../redux/csvSlice.js";

export default function CSVTable({headers, data, delta, deltaSe}) {
    const dispatch = useDispatch();

    const handleDownload = () => {
        dispatch(createZip());
    };


    return (
        <div className="col-12 ms-3">
            {data.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-secondary">
                            Provided data with calculated delta and its standard errors:
                        </h5>
                        <button className="btn btn-outline-secondary" onClick={handleDownload}>
                            Download ZIP
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-secondary">
                            <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>Delta</th>
                                <th>Delta_SE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data[0]
                                .map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {data.map((col, colIndex) => (
                                            <td key={colIndex}>{col[rowIndex]}</td>
                                        ))}
                                        <td>{delta[rowIndex]?.toFixed(4) || "N/A"}</td>
                                        <td>{deltaSe[rowIndex]?.toFixed(4) || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
