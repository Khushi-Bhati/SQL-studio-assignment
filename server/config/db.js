const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ciphersqlstudio';

let client = null;
let db = null;

async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Create indexes
    await db.collection('assignments').createIndex({ difficulty: 1 });
    await db.collection('attempts').createIndex({ assignmentId: 1, createdAt: -1 });
    
    console.log(`✓ Connected to MongoDB: ${DB_NAME}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log('✓ MongoDB connection closed');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
