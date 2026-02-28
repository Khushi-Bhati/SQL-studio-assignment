const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { difficulty } = req.query;
    
    let filter = {};
    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    
    const assignments = await db.collection('assignments')
      .find(filter)
      .project({
        title: 1,
        description: 1,
        difficulty: 1,
        createdAt: 1
      })
      .sort({ difficulty: 1, createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
});

// Get single assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const { ObjectId } = require('mongodb');
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assignment ID'
      });
    }
    
    const assignment = await db.collection('assignments').findOne({
      _id: new ObjectId(id)
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
});

module.exports = router;
