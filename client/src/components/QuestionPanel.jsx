function QuestionPanel({ assignment }) {
  if (!assignment) return null
  
  return (
    <div className="question-panel">
      <h3 className="question-panel__title">{assignment.title}</h3>
      
      <p className="question-panel__description">
        {assignment.description}
      </p>
      
      {assignment.requirements && (
        <div className="question-panel__requirements">
          <h4>Requirements</h4>
          <p>{assignment.requirements}</p>
        </div>
      )}
      
      {assignment.expectedOutput && assignment.expectedOutput.length > 0 && (
        <div className="question-panel__output">
          <h4>Expected Output Columns</h4>
          <div className="question-panel__output-fields">
            {assignment.expectedOutput.map((field, index) => (
              <span key={index} className="question-panel__output-field">
                {field.column} ({field.type})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionPanel
