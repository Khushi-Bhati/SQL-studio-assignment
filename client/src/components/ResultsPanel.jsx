function ResultsPanel({ results, isLoading, error }) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="results__empty">
          <div className="spinner"></div>
          <p className="mt-md">Executing query...</p>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="results__content results__content--error">
          <div className="results__error">
            <strong>Error: </strong>
            {error}
          </div>
        </div>
      )
    }
    
    if (!results || results.length === 0) {
      return (
        <div className="results__empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 17H5a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zm12-2h-4a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zM5 3a2 2 0 00-2 2c0 1.1.9 2 2 2h2a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2H5z" />
            <path d="M9 7H5a2 2 0 00-2 2c0 1.1.9 2 2 2h2a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-4" />
          </svg>
          <p>Run your query to see results</p>
        </div>
      )
    }
    
    // Get column names from first row
    const columns = Object.keys(results[0])
    
    return (
      <div className="results__content">
        <div className="table-container">
          <table className="results__table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {row[col] === null ? 'NULL' : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  return (
    <div className="results">
      <div className="results__header">
        <span className="results__title">Results</span>
        
        {!isLoading && !error && results && results.length > 0 && (
          <div className="results__stats">
            <span className="results__stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {results.length} rows
            </span>
          </div>
        )}
      </div>
      
      {renderContent()}
    </div>
  )
}

export default ResultsPanel
