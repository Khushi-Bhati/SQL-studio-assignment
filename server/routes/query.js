const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/postgres');
const { validateQuery } = require('../middleware/validateQuery');
const { getDB } = require('../config/db');

// Execute SQL query
router.post('/execute', validateQuery, async (req, res) => {
  try {
    const { query, assignmentId } = req.body;
    
    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }
    
    // Execute the validated query
    const result = await executeQuery(req.processedQuery);
    
    // Save attempt to database (optional feature)
    if (result.success && req.body.saveAttempt) {
      const db = getDB();
      const { ObjectId } = require('mongodb');
      
      await db.collection('attempts').insertOne({
        assignmentId: new ObjectId(assignmentId),
        query: query,
        isCorrect: null, // Would need assignment solution to determine
        createdAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute query'
    });
  }
});

// Get table schema for assignment
router.get('/schema/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const db = getDB();
    const { ObjectId } = require('mongodb');
    
    const assignment = await db.collection('assignments').findOne({
      _id: new ObjectId(assignmentId)
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      data: assignment.tables || []
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch schema'
    });
  }
});

module.exports = router;
