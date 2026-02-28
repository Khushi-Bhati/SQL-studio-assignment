const OpenAI = require('openai');

// Check if OpenAI API key is available and valid
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const isValidApiKey = apiKey && apiKey.length > 10 && !apiKey.includes('dummy');

// Initialize OpenAI client only if valid key exists
let openai = null;
if (isValidApiKey) {
  openai = new OpenAI({ apiKey });
}

// Fallback hints if LLM is not available
const fallbackHints = {
  basic: [
    'Start by selecting the required columns from the table.',
    'Consider what data you need to filter.',
    'Think about which tables contain the information you need.',
    'Review the sample data to understand the table structure.',
    'Break down the problem into smaller steps.'
  ],
  medium: [
    'You might need to use a WHERE clause to filter results.',
    'Consider using aggregate functions like COUNT, SUM, or AVG.',
    'Think about how to join multiple tables if needed.',
    'Look at the expected output to understand what columns are needed.',
    'The solution may require filtering with specific conditions.'
  ],
  detailed: [
    'This query likely requires a JOIN between multiple tables.',
    'Consider using GROUP BY with an aggregate function.',
    'You may need to use subqueries or CTEs for complex logic.',
    'Think about the order of operations in your query.',
    'The solution might require using HAVING to filter aggregated results.'
  ]
};

async function generateHint({ assignment, userQuery, hintLevel }) {
  // Use fallback hints if OpenAI is not configured
  if (!openai) {
    console.warn('No valid OpenAI API key found, using fallback hints');
    const hints = fallbackHints[hintLevel] || fallbackHints.basic;
    return hints[Math.floor(Math.random() * hints.length)];
  }

  try {
    // Build the prompt for the LLM
    const prompt = buildHintPrompt(assignment, userQuery, hintLevel);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful SQL tutor. Your role is to provide hints to students learning SQL, NOT complete solutions. 
          
Guidelines:
- NEVER provide the full solution or complete query
- Focus on guiding the student to think in the right direction
- Use the hint level to determine how much help to provide:
  - basic: Point to relevant concepts, suggest starting points
  - medium: Provide more specific guidance without giving away the answer
  - detailed: Give closer hints while still not revealing the solution
- Encourage the student to think through the problem
- If the student has started a query, provide feedback on their approach`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('LLM error:', error.message);
    
    // Fallback to predefined hints on error
    const hints = fallbackHints[hintLevel] || fallbackHints.basic;
    return hints[Math.floor(Math.random() * hints.length)];
  }
}

function buildHintPrompt(assignment, userQuery, hintLevel) {
  const tablesInfo = assignment.tables?.map(table => {
    const columns = table.columns?.map(c => `  - ${c.name} (${c.type})`).join('\n');
    return `Table: ${table.name}\nColumns:\n${columns}`;
  }).join('\n\n') || 'No table information available';

  let prompt = `I need a ${hintLevel} hint for the following SQL assignment:

**Assignment Title:** ${assignment.title}
**Difficulty:** ${assignment.difficulty}
**Description:** ${assignment.description}
**Requirements:** ${assignment.requirements || 'N/A'}

**Available Tables:**
${tablesInfo}`;

  if (userQuery && userQuery.trim()) {
    prompt += `\n\n**Current Query:**\n\`\`\`sql\n${userQuery}\n\`\`\`
    
Please provide a hint that helps me without giving away the solution.`;
  } else {
    prompt += `\n\nI haven't written any query yet. Please provide a ${hintLevel} hint to get me started.`;
  }

  return prompt;
}

module.exports = {
  generateHint,
  buildHintPrompt
};
