import {useState} from "react";

export default function CSVTable({headers, data, delta, deltaSe, isDarkMode}) {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="col-10">
            {data.length > 0 && (
                <>
                    <h5 className={isDarkMode ? "text-light" : "text-secondary"}>Provided data with calculated delta and its standard errors:</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-secondary">
                            <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>Delta</th>
                                <th>Delta SE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data[0]
                                .slice(0, showAll ? data[0].length : 2)
                                .map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {data.map((col, colIndex) => (
                                            <td key={colIndex}>{col[rowIndex]}</td>
                                        ))}
                                        <td>{delta[rowIndex]?.toFixed(4) || "N/A"}</td>
                                        <td>{deltaSe[rowIndex]?.toFixed(4) || "N/A"}</td>
                                    </tr>
                                ))}

                            <tr>
                                <td colSpan={headers.length + 2} className="text-end">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowAll(!showAll)}
                                    >
                                        {showAll ? "Show Less" : "Show More"}
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
