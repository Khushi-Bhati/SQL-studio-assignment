import { useState } from 'react'

function SampleDataViewer({ tables }) {
  const [openTables, setOpenTables] = useState({})
  
  const toggleTable = (tableName) => {
    setOpenTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }))
  }
  
  if (!tables || tables.length === 0) {
    return null
  }
  
  return (
    <div className="sample-data">
      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="sample-data__item">
          <div 
            className="sample-data__header"
            onClick={() => toggleTable(table.name)}
          >
            <span className="sample-data__title">
              {table.name}
            </span>
            <svg 
              className={`sample-data__toggle ${openTables[table.name] ? 'sample-data__toggle--open' : ''}`}
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          
          <div className={`sample-data__content ${openTables[table.name] ? 'sample-data__content--open' : ''}`}>
            <div className="sample-data__table-wrapper">
              {table.columns && (
                <>
                  <div className="sample-data__table-name">
                    Schema: {table.columns.map(c => c.name).join(', ')}
                  </div>
                  
                  {table.sampleData && table.sampleData.length > 0 && (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            {Object.keys(table.sampleData[0]).map((key) => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.sampleData.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((value, valueIndex) => (
                                <td key={valueIndex}>
                                  {value === null ? 'NULL' : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {table.sampleData && table.sampleData.length > 10 && (
                    <p className="text-secondary mt-sm" style={{ fontSize: '0.75rem' }}>
                      Showing 10 of {table.sampleData.length} rows
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SampleDataViewer
