# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

![CipherSQLStudio](https://img.shields.io/badge/CipherSQLStudio-v1.0.0-e94560?style=for-the-badge)

## Features

- 📚 **Assignment Listing** - Browse SQL assignments by difficulty (Beginner, Intermediate, Advanced)
- 💻 **SQL Editor** - Monaco Editor with SQL syntax highlighting
- ⚡ **Real-time Execution** - Execute queries against PostgreSQL and see results instantly
- 💡 **Intelligent Hints** - Get AI-powered hints (not solutions) to guide your learning
- 📊 **Sample Data Viewer** - View table schemas and sample data for each assignment
- 🎯 **Progressive Learning** - Assignments range from basic SELECT queries to complex JOINs

## Tech Stack

### Frontend
- **React.js 18** - UI Framework
- **Monaco Editor** - Code Editor
- **SCSS** - Styling with mobile-first responsive design
- **Vite** - Build Tool

### Backend
- **Node.js / Express.js** - Server Runtime
- **PostgreSQL** - Sandbox Database for SQL execution
- **MongoDB** - Persistence for assignments and attempts
- **OpenAI/GPT** - LLM for hint generation

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- MongoDB 6.0+
- npm or yarn

## Quick Start

### 1. Clone and Install

```
bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install
cd ..
```

### 2. Configure Environment

```
bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your database credentials:

```
env
# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=ciphersqlstudio

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ciphersqlstudio

# OpenAI (Optional - for hints)
OPENAI_API_KEY=your_openai_key
```

### 3. Setup Databases

#### PostgreSQL Setup

```
bash
# Create the database
createdb ciphersqlstudio

# Seed sample data
npm run seed
```

#### MongoDB Setup

```
bash
# The database will be created automatically when you run the seed script
node database/assignments.js
```

### 4. Start the Application

```
bash
# Development mode (runs both server and client)
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Project Structure

```
SQL-studio-assignment/
├── server/                    # Backend server
│   ├── config/                # Database configurations
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── index.js               # Server entry point
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── styles/           # SCSS styles
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   └── public/               # Static assets
├── database/                  # Database seeding scripts
├── package.json              # Root dependencies
├── SPEC.md                   # Project specification
└── README.md                 # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server and client in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend client |
| `npm run seed` | Seed PostgreSQL with sample data |
| `npm start` | Start production server |

## SQL Assignments Included

1. **Beginner**
   - Select All Employees
   - High Earners (WHERE clause)
   - Department Employees (Filtering)

2. **Intermediate**
   - Department Summary (JOIN + GROUP BY)
   - Average Salary by Department
   - Top Earners (ORDER BY + LIMIT)
   - Projects and Team Members (Multiple JOINs)
   - Order Statistics (Aggregate functions)

3. **Advanced**
   - Expensive Orders (Subqueries)
   - Multi-table Analysis (Complex JOINs)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get assignment details |
| POST | `/api/query/execute` | Execute SQL query |
| POST | `/api/hints/generate` | Generate AI hint |

## Security

- Query validation blocks DDL/DML operations (DROP, DELETE, UPDATE, INSERT, etc.)
- Only SELECT and WITH (CTE) queries are allowed
- Query timeout: 10 seconds
- Result limit: 1000 rows

## License

MIT
