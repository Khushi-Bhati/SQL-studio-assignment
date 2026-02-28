import { useState, useEffect } from 'react'

function HintModal({ isOpen, onClose, assignmentId, userQuery, onLoadingChange }) {
  const [hintLevel, setHintLevel] = useState('basic')
  const [hint, setHint] = useState('')
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      fetchHint()
    }
  }, [isOpen, hintLevel])
  
  const fetchHint = async () => {
    setIsLoadingHint(true)
    if (onLoadingChange) onLoadingChange(true)
    
    try {
      const response = await fetch('/api/hints/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          userQuery,
          hintLevel
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setHint(data.hint)
      } else {
        setHint('Failed to generate hint. Please try again.')
      }
    } catch (error) {
      setHint('Error connecting to server. Please try again.')
    } finally {
      setIsLoadingHint(false)
      if (onLoadingChange) onLoadingChange(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Get a Hint</h3>
          <button className="modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="hint-content">
          <div className="hint-content__level">
            <button 
              className={`hint-content__level-btn ${hintLevel === 'basic' ? 'hint-content__level-btn--active' : ''}`}
              onClick={() => setHintLevel('basic')}
            >
              Basic
            </button>
            <button 
              className={`hint-content__level-btn ${hintLevel === 'medium' ? 'hint-content__level-btn--active' : ''}`}
              onClick={() => setHintLevel('medium')}
            >
              Medium
            </button>
            <button 
              className={`hint-content__level-btn ${hintLevel === 'detailed' ? 'hint-content__level-btn--active' : ''}`}
              onClick={() => setHintLevel('detailed')}
            >
              Detailed
            </button>
          </div>
          
          {isLoadingHint ? (
            <div className="flex flex--center p-lg">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="hint-content__text">
              {hint || 'Loading hint...'}
            </div>
          )}
          
          <p className="hint-content__disclaimer">
            💡 This is a hint to guide you, not the complete solution. 
            Think about how you can use this to build your query!
          </p>
        </div>
        
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={fetchHint}>
            Regenerate Hint
          </button>
          <button className="btn btn--primary" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default HintModal
