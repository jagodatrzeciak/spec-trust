export default function CSVTable({headers, data, delta, deltaSe}) {

    const handleDownloadCSV = () => {
        const fullHeaders = [...headers, "δ", "SEδ"];

        const rows = data[0].map((_, rowIndex) => {
            const rowValues = data.map(col => col[rowIndex])
            const deltaVal = delta[rowIndex]?.toFixed(4) ?? "N/A"
            const deltaSeVal = deltaSe[rowIndex]?.toFixed(4) ?? "N/A"
            return [...rowValues, deltaVal, deltaSeVal]
        })

        const csvContent = [
            fullHeaders.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, "-")
        const filename = `spectrust_results_${timestamp}.csv`

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", filename)
        link.click()
    };


    return (
        <div className="col-10">
            {data.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-secondary">
                            Provided data with calculated delta and its standard errors:
                        </h5>
                        <button className="btn btn-outline-secondary" onClick={handleDownloadCSV}>
                            Download CSV
                        </button>
                    </div>
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
