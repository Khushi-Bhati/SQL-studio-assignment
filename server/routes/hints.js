const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { generateHint } = require('../utils/llm');

// Generate hint for assignment
router.post('/generate', async (req, res) => {
  try {
    const { assignmentId, userQuery, hintLevel = 'basic' } = req.body;
    
    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }
    
    // Validate hint level
    if (!['basic', 'medium', 'detailed'].includes(hintLevel)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid hint level. Must be basic, medium, or detailed'
      });
    }
    
    // Fetch assignment details
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
    
    // Generate hint using LLM
    const hint = await generateHint({
      assignment,
      userQuery,
      hintLevel
    });
    
    res.json({
      success: true,
      hint,
      hintLevel
    });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint'
    });
  }
});

module.exports = router;
