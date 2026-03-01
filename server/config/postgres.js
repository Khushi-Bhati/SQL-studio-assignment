const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
  }
  : {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'ciphersqlstudio',
  };

const pool = new Pool({
  ...poolConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

async function testPostgresConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log(`✓ PostgreSQL connected: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    console.warn('Note: Make sure PostgreSQL is running and the database exists');
    return false;
  }
}

async function executeQuery(query, timeout = 10000) {
  const client = await pool.connect();
  try {
    // Set statement timeout
    await client.query(`SET statement_timeout = ${timeout}`);

    const startTime = Date.now();
    const result = await client.query(query);
    const executionTime = Date.now() - startTime;

    return {
      success: true,
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map(f => ({ name: f.name, dataTypeID: f.dataTypeID })),
      executionTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  } finally {
    client.release();
  }
}

async function getTableSchema(tableName) {
  const query = `
    SELECT 
      column_name, 
      data_type, 
      character_maximum_length,
      is_nullable
    FROM information_schema.columns 
    WHERE table_name = $1
    ORDER BY ordinal_position
  `;

  try {
    const result = await pool.query(query, [tableName]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching table schema:', error);
    throw error;
  }
}

async function getTableData(tableName, limit = 20) {
  try {
    // Sanitize table name to prevent SQL injection
    const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    const query = `SELECT * FROM ${safeTableName} LIMIT ${parseInt(limit, 10)}`;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testPostgresConnection,
  executeQuery,
  getTableSchema,
  getTableData
};
