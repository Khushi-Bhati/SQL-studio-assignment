// Query validation and sanitization middleware
// Only allows SELECT and WITH (CTE) queries for security

const ALLOWED_KEYWORDS = [
  'SELECT', 'WITH', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'HAVING',
  'LIMIT', 'OFFSET', 'AS', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'CROSS', 'FULL', 'ON', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE',
  'IS', 'NULL', 'TRUE', 'FALSE', 'DISTINCT', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'ASC', 'DESC', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'ALL', 'EXISTS', 'ANY', 'SOME', 'COALESCE', 'NULLIF',
  'CAST', 'CONVERT', 'EXTRACT', 'INTERVAL', 'NOW', 'CURRENT_DATE',
  'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'VARCHAR', 'INTEGER', 'INT',
  'BIGINT', 'SMALLINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'REAL', 'DOUBLE',
  'PRECISION', 'CHAR', 'TEXT', 'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP'
];

const BLOCKED_PATTERNS = [
  /^\s*DROP\s+/i,
  /^\s*DELETE\s+/i,
  /^\s*UPDATE\s+/i,
  /^\s*INSERT\s+/i,
  /^\s*ALTER\s+/i,
  /^\s*TRUNCATE\s+/i,
  /^\s*CREATE\s+/i,
  /^\s*GRANT\s+/i,
  /^\s*REVOKE\s+/i,
  /^\s*EXEC/i,
  /^\s*EXECUTE/i,
  /--/g,  // Block comments
  /\/\*/g,  // Block comment start
  /\*\//g,  // Block comment end
];

const MAX_QUERY_LENGTH = 5000;
const MAX_RESULT_ROWS = 1000;

function validateQuery(req, res, next) {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Query is required'
    });
  }

  const trimmedQuery = query.trim();

  // Check query length
  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`
    });
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmedQuery)) {
      return res.status(400).json({
        success: false,
        error: 'Query contains disallowed operations. Only SELECT queries are allowed.'
      });
    }
  }

  // Must start with SELECT or WITH
  if (!/^\s*(SELECT|WITH)/i.test(trimmedQuery)) {
    return res.status(400).json({
      success: false,
      error: 'Query must start with SELECT or WITH'
    });
  }

  // Check for dangerous functions that could be used for malicious purposes
  const dangerousFunctions = [
    /pg_read_file/i,
    /pg_ls_dir/i,
    /pg_read_server_files/i,
    /copy/i,
    /pg_catalog\./i,
  ];

  for (const func of dangerousFunctions) {
    if (func.test(trimmedQuery)) {
      return res.status(400).json({
        success: false,
        error: 'Query contains disallowed functions'
      });
    }
  }

  // Add row limit if not present
  let processedQuery = trimmedQuery;
  if (!/LIMIT\s+\d+/i.test(trimmedQuery)) {
    processedQuery = `${trimmedQuery} LIMIT ${MAX_RESULT_ROWS}`;
  }

  req.processedQuery = processedQuery;
  next();
}

module.exports = {
  validateQuery,
  MAX_QUERY_LENGTH,
  MAX_RESULT_ROWS
};
