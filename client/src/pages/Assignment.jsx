import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionPanel from '../components/QuestionPanel'
import SampleDataViewer from '../components/SampleDataViewer'
import SqlEditor from '../components/SqlEditor'
import ResultsPanel from '../components/ResultsPanel'
import HintModal from '../components/HintModal'
import api from '../services/api'

function Assignment() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [assignment, setAssignment] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHintOpen, setIsHintOpen] = useState(false)
  const [isHintLoading, setIsHintLoading] = useState(false)
  
  useEffect(() => {
    fetchAssignment()
  }, [id])
  
  const fetchAssignment = async () => {
    try {
      const data = await api.getAssignment(id)
      setAssignment(data)
    } catch (err) {
      console.error('Error loading assignment:', err)
    }
  }
  
  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query')
      setResults(null)
      return
    }
    
    setIsLoading(true)
    setError(null)
    setResults(null)
    
    try {
      const data = await api.executeQuery(query, id)
      
      if (data.success) {
        setResults(data.rows)
        setError(null)
      } else {
        setError(data.error)
        setResults(null)
      }
    } catch (err) {
      setError(err.message)
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  const resetQuery = () => {
    setQuery('')
    setResults(null)
    setError(null)
  }
  
  const handleHintClose = () => {
    setIsHintOpen(false)
  }
  
  const handleHintLoading = (loading) => {
    setIsHintLoading(loading)
  }
  
  if (!assignment) {
    return (
      <div className="flex flex--center p-xl">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return (
    <div className="assignment">
      <div className="assignment__header">
        <button 
          className="assignment__back"
          onClick={() => navigate('/')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Assignments
        </button>
        
        <h1 className="assignment__title">{assignment.title}</h1>
      </div>
      
      <div className="assignment__layout">
        <div className="assignment__left-panel">
          <QuestionPanel assignment={assignment} />
          
          <div className="mt-lg">
            <h4 className="mb-md" style={{ color: '#a0a0a0' }}>Sample Data</h4>
            <SampleDataViewer tables={assignment.tables} />
          </div>
        </div>
        
        <div className="assignment__right-panel">
          <SqlEditor
            value={query}
            onChange={setQuery}
            onRun={executeQuery}
          />
          
          <div className="sql-editor__footer">
            <div className="sql-editor__actions">
              <button 
                className="btn btn--primary"
                onClick={executeQuery}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                    Running...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Run Query
                  </>
                )}
              </button>
              
              <button 
                className="btn btn--secondary"
                onClick={() => setIsHintOpen(true)}
                disabled={isHintLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
                Get Hint
              </button>
              
              <button 
                className="btn btn--ghost"
                onClick={resetQuery}
              >
                Reset
              </button>
            </div>
          </div>
          
          <ResultsPanel
            results={results}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
      
      <HintModal
        isOpen={isHintOpen}
        onClose={handleHintClose}
        assignmentId={id}
        userQuery={query}
        onLoadingChange={handleHintLoading}
      />
    </div>
  )
}

export default Assignment
