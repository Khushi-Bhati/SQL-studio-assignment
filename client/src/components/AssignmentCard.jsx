import { useNavigate } from 'react-router-dom'

function AssignmentCard({ assignment }) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/assignment/${assignment._id}`)
  }
  
  const getDifficultyClass = () => {
    return `assignment-card--${assignment.difficulty}`
  }
  
  return (
    <div 
      className={`assignment-card ${getDifficultyClass()}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <span className={`badge badge--${assignment.difficulty}`}>
          {assignment.difficulty}
        </span>
      </div>
      
      <p className="assignment-card__description">
        {assignment.description}
      </p>
      
      <div className="assignment-card__footer">
        <span className="assignment-card__difficulty text-secondary">
          {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
        </span>
      </div>
    </div>
  )
}

export default AssignmentCard
