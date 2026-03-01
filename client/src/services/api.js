const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const api = {
  // Assignments
  async getAssignments(difficulty = null) {
    const url = difficulty
      ? `${API_BASE}/assignments?difficulty=${difficulty}`
      : `${API_BASE}/assignments`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch assignments')
    }

    return data.data
  },

  async getAssignment(id) {
    const response = await fetch(`${API_BASE}/assignments/${id}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch assignment')
    }

    return data.data
  },

  // Query Execution
  async executeQuery(query, assignmentId) {
    const response = await fetch(`${API_BASE}/query/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        assignmentId,
        saveAttempt: false
      })
    })

    const data = await response.json()

    if (!data.success && !response.ok) {
      throw new Error(data.error || 'Failed to execute query')
    }

    return data
  },

  // Hints
  async generateHint(assignmentId, userQuery, hintLevel = 'basic') {
    const response = await fetch(`${API_BASE}/hints/generate`, {
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

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate hint')
    }

    return data
  }
}

export default api
