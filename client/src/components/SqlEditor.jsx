import Editor from '@monaco-editor/react'

function SqlEditor({ value, onChange, onRun }) {
  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue || '')
    }
  }
  
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to run query
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (onRun) {
        onRun()
      }
    }
  }
  
  return (
    <div className="sql-editor">
      <div className="sql-editor__header">
        <span className="sql-editor__title">SQL Query</span>
        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
          Ctrl + Enter to run
        </span>
      </div>
      
      <div className="sql-editor__wrapper" onKeyDown={handleKeyDown}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
        />
      </div>
    </div>
  )
}

export default SqlEditor
