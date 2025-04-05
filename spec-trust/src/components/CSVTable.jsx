export default function CSVTable({headers, data, delta, deltaSe}) {

    return (
        <div className="col-10">
            {data.length > 0 && (
                <>
                    <h5 className={"text-secondary"}>Provided data with calculated delta and its standard errors:</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-secondary">
                            <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>δ</th>
                                <th>SE<sub>δ</sub></th>
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
