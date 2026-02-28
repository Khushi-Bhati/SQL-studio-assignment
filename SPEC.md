# CipherSQLStudio - Specification Document

## 1. Project Overview

**Project Name:** CipherSQLStudio
**Project Type:** Full-stack Web Application (SQL Learning Platform)
**Core Functionality:** A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.
**Target Users:** Students learning SQL, educators managing SQL assignments

---

## 2. Technical Stack

### Frontend
- **Framework:** React.js 18+
- **Styling:** Vanilla SCSS with mobile-first responsive design
- **Code Editor:** Monaco Editor
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js with Express.js
- **Database (Sandbox):** PostgreSQL
- **Persistence DB:** MongoDB (Atlas)
- **LLM Integration:** OpenAI GPT API / Gemini API

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** `#1a1a2e` (Deep Navy)
- **Secondary:** `#16213e` (Dark Blue)
- **Accent:** `#e94560` (Coral Red)
- **Success:** `#00d9a5` (Mint Green)
- **Warning:** `#ffc947` (Amber)
- **Error:** `#ff4757` (Red)
- **Text Primary:** `#eaeaea` (Light Gray)
- **Text Secondary:** `#a0a0a0` (Medium Gray)
- **Background:** `#0f0f1a` (Near Black)
- **Surface:** `#1e1e30` (Card Background)
- **Border:** `#2d2d44` (Subtle Border)

### Typography
- **Primary Font:** 'JetBrains Mono', monospace (for code/editor)
- **Secondary Font:** 'Outfit', sans-serif (for UI text)
- **Heading Sizes:** 
  - H1: 2.5rem
  - H2: 2rem
  - H3: 1.5rem
  - H4: 1.25rem
- **Body Text:** 1rem (16px)
- **Small Text:** 0.875rem (14px)

### Responsive Breakpoints
- **Mobile:** 320px - 640px
- **Tablet:** 641px - 1023px
- **Desktop:** 1024px - 1280px
- **Large Desktop:** 1281px+

### Layout Structure

#### Assignment Listing Page (Home)
```
┌─────────────────────────────────────────┐
│ Header (Logo + Navigation)              │
├─────────────────────────────────────────┤
│ Hero Section                            │
│ - Title: "CipherSQLStudio"              │
│ - Subtitle: "Master SQL Through Practice"│
├─────────────────────────────────────────┤
│ Filter Bar (Difficulty All/Beginner/    │
│ Intermediate/Advanced)                  │
├─────────────────────────────────────────┤
│ Assignment Grid (3 cols desktop,        │
│ 2 cols tablet, 1 col mobile)             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │     │
│ └─────────┘ └─────────┘ └─────────┘     │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

#### Assignment Attempt Interface
```
┌─────────────────────────────────────────────────────┐
│ Header (Logo + Assignment Title + Back Button)      │
├────────────────────────┬────────────────────────────┤
│ LEFT PANEL (40%)       │ RIGHT PANEL (60%)           │
│ ┌────────────────────┐ │ ┌────────────────────────┐  │
│ │ Question Panel    │ │ │ SQL Editor (Monaco)    │  │
│ │ - Title           │ │ │                        │  │
│ │ - Description     │ │ │                        │  │
│ │ - Requirements    │ │ └────────────────────────┘  │
│ │ - Expected Output │ │ ┌────────────────────────┐  │
│ └────────────────────┘ │ │ Results Panel         │  │
│ ┌────────────────────┑ │ │ - Table/Error Message │  │
│ │ Sample Data Viewer│ │ │ - Row Count           │  │
│ │ - Table Schemas   │ │ └────────────────────────┘  │
│ │ - Sample Rows    │ │ ┌────────────────────────┐   │
│ └────────────────────┘ │ │ Action Buttons       │   │
│                        │ │ [Run] [Hint] [Reset]  │   │
│                        │ └──────────────────────┘   │
└────────────────────────┴────────────────────────────┘
```

### Component Specifications

#### Assignment Card
- Border radius: 12px
- Padding: 24px
- Background: Surface color
- Hover: Subtle lift (translateY -4px) + glow effect
- Difficulty badge: Color-coded pill (Beginner: Green, Intermediate: Amber, Advanced: Red)

#### Button Styles
- Primary: Accent color background, white text, 8px border-radius
- Secondary: Transparent with border, accent text
- Hover: Brightness increase + subtle scale
- Active: Scale down slightly
- Disabled: 50% opacity

#### SQL Editor (Monaco)
- Theme: VS Code Dark+
- Language: SQL
- Minimap: Disabled (for cleaner mobile view)
- Font size: 14px
- Line numbers: Enabled

#### Results Table
- Striped rows (alternating surface colors)
- Sticky header
- Horizontal scroll for overflow
- Max height with vertical scroll

---

## 4. Functionality Specification

### Core Features

#### 4.1 Assignment Listing
- Fetch all assignments from API on load
- Display in responsive grid
- Filter by difficulty level
- Click to navigate to assignment attempt page

#### 4.2 Assignment Attempt Interface
- **Question Panel:** Display assignment title, description, requirements, and expected output schema
- **Sample Data Viewer:** 
  - Show table schemas (columns, types)
  - Display sample data rows (first 10-20 rows)
  - Expandable/collapsible sections
- **SQL Editor:** Monaco editor with SQL syntax highlighting
- **Results Panel:**
  - Execute query and display results in table
  - Show error messages with red styling
  - Display row count and execution time
- **Action Buttons:**
  - Run Query (Primary)
  - Get Hint (Secondary)
  - Reset Editor (Secondary)

#### 4.3 Query Execution Engine
- POST /api/query/execute endpoint
- Accept: { assignmentId, query }
- Validate query (whitelist allowed operations: SELECT, WITH)
- Block dangerous operations: DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE
- Execute against PostgreSQL sandbox database
- Return: { success: boolean, results: [], error?: string, executionTime: number }
- Query timeout: 10 seconds

#### 4.4 LLM Hint Integration
- POST /api/hints/generate endpoint
- Accept: { assignmentId, userQuery?, hintLevel: 'basic' | 'medium' | 'detailed' }
- Use prompt engineering to provide guidance without revealing solution
- Include in prompt: assignment question, sample schema, user's any)
- Return current query (if: { hint: string }

### Data Models

#### Assignment (MongoDB)
```
javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  requirements: String,
  expectedOutput: [{
    column: String,
    type: String
  }],
  tables: [{
    name: String,
    columns: [{
      name: String,
      type: String
    }],
    sampleData: Array
  }],
  hints: {
    basic: String,
    medium: String,
    detailed: String
  },
  createdAt: Date
}
```

#### UserAttempt (MongoDB) - Optional
```
javascript
{
  _id: ObjectId,
  userId: String (sessionId if not logged in),
  assignmentId: ObjectId,
  query: String,
  isCorrect: Boolean,
  createdAt: Date
}
```

---

## 5. API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/assignments | List all assignments |
| GET | /api/assignments/:id | Get single assignment details |
| POST | /api/query/execute | Execute SQL query |
| POST | /api/hints/generate | Get LLM hint |
| POST | /api/attempts/save | Save user attempt (optional) |
| GET | /api/attempts/:assignmentId | Get saved attempts (optional) |

---

## 6. Security Requirements

### Query Sanitization
- Whitelist allowed SQL keywords: SELECT, WITH, FROM, WHERE, GROUP BY, ORDER BY, HAVING, LIMIT, OFFSET, AS, JOIN, LEFT, RIGHT, INNER, OUTER, ON, AND, OR, NOT, IN, BETWEEN, LIKE, IS, NULL, DISTINCT, COUNT, SUM, AVG, MIN, MAX, ASC, DESC
- Block all DDL and DML operations
- Set query timeout (10 seconds)
- Limit result rows (1000 max)

### API Security
- CORS configuration for frontend origin
- Request body size limits
- Rate limiting on query execution endpoint

---

## 7. File Structure

```
SQL-studio-assignment/
├── SPEC.md
├── README.md
├── package.json
├── .env.example
├── server/
│   ├── index.js
│   ├── config/
│   │   ├── db.js
│   │   └── postgres.js
│   ├── routes/
│   │   ├── assignments.js
│   │   ├── query.js
│   │   └── hints.js
│   ├── middleware/
│   │   └── validateQuery.js
│   └── utils/
│       └── llm.js
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── styles/
│   │   │   ├── main.scss
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── _reset.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _components.scss
│   │   │   ├── _layout.scss
│   │   │   └── _pages.scss
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── QuestionPanel.jsx
│   │   │   ├── SampleDataViewer.jsx
│   │   │   ├── SqlEditor.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   └── HintModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Assignment.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── helpers.js
│   └── public/
│       └── favicon.ico
└── database/
    └── seed.js
```

---

## 8. Acceptance Criteria

### Must Pass
- [ ] Assignment listing page displays all assignments
- [ ] Clicking assignment navigates to attempt interface
- [ ] SQL editor has syntax highlighting
- [ ] Query execution returns results in table format
- [ ] Invalid queries show error messages
- [ ] Get Hint button provides relevant hints
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] SCSS uses variables, mixins, nesting, partials

### Visual Checkpoints
- [ ] Dark theme applied consistently
- [ ] Typography hierarchy is clear
- [ ] Cards have hover effects
- [ ] Buttons have proper states
- [ ] Results table is scrollable
- [ ] Mobile navigation is usable

---

## 9. Sample Assignment Data

### Assignment 1: Basic SELECT
**Title:** Select All Employees
**Difficulty:** Beginner
**Description:** Retrieve all employee records from the employees table.
**Tables:** employees (id, name, department, salary, hire_date)
**Expected Output:** All columns from employees table

### Assignment 2: WHERE Clause
**Title:** High Earners
**Difficulty:** Beginner
**Description:** Find all employees earning more than $50,000.
**Tables:** employees (id, name, department, salary, hire_date)
**Expected Output:** Employees with salary > 50000

### Assignment 3: JOIN Operations
**Title:** Department Summary
**Difficulty:** Intermediate
**Description:** List all departments with their employee count and total salary.
**Tables:** employees (id, name, department_id, salary), departments (id, name, location)
**Expected Output:** department_name, employee_count, total_salary

---

## 10. Implementation Priority

1. **Phase 1:** Project setup (React + Express)
2. **Phase 2:** Basic UI components and styling
3. **Phase 3:** Assignment listing and navigation
4. **Phase 4:** SQL execution backend
5. **Phase 5:** Monaco editor integration
6. **Phase 6:** Results display
7. **Phase 7:** LLM hint integration
8. **Phase 8:** Polish and responsive design
