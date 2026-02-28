import { useState, useEffect } from 'react'
import AssignmentCard from '../components/AssignmentCard'
import api from '../services/api'

function Home() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    fetchAssignments()
  }, [filter])
  
  const fetchAssignments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await api.getAssignments(filter === 'all' ? null : filter)
      setAssignments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]
  
  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">CipherSQLStudio</h1>
        <p className="home__subtitle">
          Master SQL through interactive practice. Write queries, get hints, and see real-time results.
        </p>
      </section>
      
      <section className="section">
        <div className="home__filters">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`home__filter-btn ${filter === f.value ? 'home__filter-btn--active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex flex--center p-xl">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h3 className="empty-state__title">Error Loading Assignments</h3>
            <p className="empty-state__description">{error}</p>
            <button className="btn btn--primary mt-lg" onClick={fetchAssignments}>
              Try Again
            </button>
          </div>
        ) : assignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h3 className="empty-state__title">No Assignments Found</h3>
            <p className="empty-state__description">
              No assignments match the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid grid--3">
            {assignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id} 
                assignment={assignment} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
