const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ciphersqlstudio';

const assignments = [
  {
    title: "Select All Employees",
    description: "Retrieve all employee records from the employees table to understand the basic table structure and data.",
    difficulty: "beginner",
    requirements: "Select all columns from the employees table. Use SELECT * to retrieve all data.",
    expectedOutput: [
      { column: "id", type: "integer" },
      { column: "name", type: "string" },
      { column: "email", type: "string" },
      { column: "department_id", type: "integer" },
      { column: "salary", type: "decimal" },
      { column: "hire_date", type: "date" },
      { column: "manager_id", type: "integer" }
    ],
    tables: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "email", type: "varchar" },
          { name: "department_id", type: "integer" },
          { name: "salary", type: "decimal" },
          { name: "hire_date", type: "date" },
          { name: "manager_id", type: "integer" }
        ],
        sampleData: [
          { id: 1, name: "John Smith", email: "john.smith@company.com", department_id: 1, salary: 85000, hire_date: "2020-01-15", manager_id: null },
          { id: 2, name: "Sarah Johnson", email: "sarah.johnson@company.com", department_id: 1, salary: 75000, hire_date: "2020-03-20", manager_id: 1 },
          { id: 3, name: "Michael Brown", email: "michael.brown@company.com", department_id: 1, salary: 70000, hire_date: "2021-06-01", manager_id: 1 }
        ]
      }
    ],
    hints: {
      basic: "Use SELECT * to retrieve all columns from a table. The FROM clause specifies which table to query.",
      medium: "Your query should start with SELECT * FROM employees. This will return all rows and columns from the employees table.",
      detailed: "Write: SELECT * FROM employees; This uses the asterisk (*) wildcard to select all columns. The semicolon terminates the SQL statement."
    }
  },
  {
    title: "High Earners",
    description: "Find all employees earning more than $50,000 using the WHERE clause to filter results.",
    difficulty: "beginner",
    requirements: "Filter employees where salary is greater than 50000. Use a WHERE clause with the > operator.",
    expectedOutput: [
      { column: "id", type: "integer" },
      { column: "name", type: "string" },
      { column: "salary", type: "decimal" }
    ],
    tables: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "email", type: "varchar" },
          { name: "department_id", type: "integer" },
          { name: "salary", type: "decimal" },
          { name: "hire_date", type: "date" },
          { name: "manager_id", type: "integer" }
        ],
        sampleData: [
          { id: 1, name: "John Smith", salary: 85000 },
          { id: 2, name: "Sarah Johnson", salary: 75000 },
          { id: 3, name: "Michael Brown", salary: 70000 },
          { id: 4, name: "Emily Davis", salary: 65000 },
          { id: 5, name: "David Wilson", salary: 60000 }
        ]
      }
    ],
    hints: {
      basic: "You need to filter results based on a condition. Consider using the WHERE clause with a comparison operator.",
      medium: "Use WHERE salary > 50000 to filter employees earning more than $50,000. Comparison operators include >, <, >=, <=, =, and <>.",
      detailed: "Write: SELECT name, salary FROM employees WHERE salary > 50000; This selects only employees whose salary exceeds 50000."
    }
  },
  {
    title: "Department Employees",
    description: "List all employees in the Engineering department (department_id = 1) with their names and salaries.",
    difficulty: "beginner",
    requirements: "Filter employees by department_id equals 1. Include name and salary columns in the output.",
    expectedOutput: [
      { column: "name", type: "string" },
      { column: "salary", type: "decimal" }
    ],
    tables: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "department_id", type: "integer" },
          { name: "salary", type: "decimal" }
        ],
        sampleData: [
          { id: 1, name: "John Smith", department_id: 1, salary: 85000 },
          { id: 2, name: "Sarah Johnson", department_id: 1, salary: 75000 },
          { id: 3, name: "Michael Brown", department_id: 1, salary: 70000 },
          { id: 4, name: "Emily Davis", department_id: 2, salary: 65000 }
        ]
      }
    ],
    hints: {
      basic: "Filter the employees table using a WHERE clause to find those in department 1.",
      medium: "Use WHERE department_id = 1 to filter for the Engineering department. Select specific columns instead of all columns.",
      detailed: "Write: SELECT name, salary FROM employees WHERE department_id = 1; This returns only Engineering department employees with their names and salaries."
    }
  },
  {
    title: "Department Summary",
    description: "List all departments with their employee count and total salary using aggregate functions and GROUP BY.",
    difficulty: "intermediate",
    requirements: "Join employees with departments. Use COUNT() for employee count and SUM() for total salary. Group by department.",
    expectedOutput: [
      { column: "department_name", type: "string" },
      { column: "employee_count", type: "integer" },
      { column: "total_salary", type: "decimal" }
    ],
    tables: [
      {
        name: "departments",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "location", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "Engineering", location: "Building A" },
          { id: 2, name: "Marketing", location: "Building B" },
          { id: 3, name: "Sales", location: "Building B" }
        ]
      },
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "department_id", type: "integer" },
          { name: "salary", type: "decimal" }
        ],
        sampleData: [
          { id: 1, name: "John Smith", department_id: 1, salary: 85000 },
          { id: 2, name: "Sarah Johnson", department_id: 1, salary: 75000 },
          { id:  3, name: "Michael Brown", department_id: 1, salary: 70000 }
        ]
      }
    ],
    hints: {
      basic: "You need to use aggregate functions (COUNT, SUM) with GROUP BY to calculate totals per department.",
      medium: "Join the departments and employees tables, then use GROUP BY department_id. Use COUNT(*) and SUM(salary) as aggregate functions.",
      detailed: "Write: SELECT d.name AS department_name, COUNT(e.id) AS employee_count, SUM(e.salary) AS total_salary FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name;"
    }
  },
  {
    title: "Average Salary by Department",
    description: "Calculate the average salary for each department and order the results from highest to lowest.",
    difficulty: "intermediate",
    requirements: "Use AVG() aggregate function, GROUP BY department, and ORDER BY to sort results in descending order.",
    expectedOutput: [
      { column: "department_name", type: "string" },
      { column: "average_salary", type: "decimal" }
    ],
    tables: [
      {
        name: "departments",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "Engineering" },
          { id: 2, name: "Marketing" },
          { id: 3, name: "Sales" }
        ]
      },
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "department_id", type: "integer" },
          { name: "salary", type: "decimal" }
        ],
        sampleData: [
          { id: 1, department_id: 1, salary: 85000 },
          { id: 2, department_id: 1, salary: 75000 },
          { id: 3, department_id: 2, salary: 65000 }
        ]
      }
    ],
    hints: {
      basic: "Use AVG() to calculate averages, GROUP BY to group by department, and ORDER BY to sort results.",
      medium: "AVG(salary) calculates average salary. Use ORDER BY average_salary DESC to show highest averages first. ROUND() can format the result.",
      detailed: "Write: SELECT d.name AS department_name, ROUND(AVG(e.salary), 2) AS average_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY average_salary DESC;"
    }
  },
  {
    title: "Top Earners",
    description: "Find the top 3 highest paid employees in the company.",
    difficulty: "intermediate",
    requirements: "Order by salary in descending order and use LIMIT to get only top 3 employees.",
    expectedOutput: [
      { column: "name", type: "string" },
      { column: "salary", type: "decimal" }
    ],
    tables: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "salary", type: "decimal" }
        ],
        sampleData: [
          { id: 1, name: "John Smith", salary: 85000 },
          { id: 2, name: "Sarah Johnson", salary: 75000 },
          { id: 3, name: "Michael Brown", salary: 70000 },
          { id: 4, name: "Emily Davis", salary: 65000 }
        ]
      }
    ],
    hints: {
      basic: "Use ORDER BY to sort and LIMIT to restrict the number of results.",
      medium: "ORDER BY salary DESC arranges highest salaries first. LIMIT 3 restricts to top 3 results.",
      detailed: "Write: SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;"
    }
  },
  {
    title: "Projects and Team Members",
    description: "List all projects with the names of team members assigned to each project.",
    difficulty: "intermediate",
    requirements: "Join projects, project_assignments, and employees tables. Use LEFT JOIN to include projects with no assignments.",
    expectedOutput: [
      { column: "project_name", type: "string" },
      { column: "employee_name", type: "string" },
      { column: "role", type: "string" }
    ],
    tables: [
      {
        name: "projects",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" },
          { name: "status", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "Website Redesign", status: "active" },
          { id: 2, name: "Mobile App", status: "active" }
        ]
      },
      {
        name: "project_assignments",
        columns: [
          { name: "id", type: "integer" },
          { name: "project_id", type: "integer" },
          { name: "employee_id", type: "integer" },
          { name: "role", type: "varchar" }
        ],
        sampleData: [
          { id: 1, project_id: 1, employee_id: 1, role: "Lead Developer" },
          { id: 2, project_id: 1, employee_id: 2, role: "Backend Developer" }
        ]
      },
      {
        name: "employees",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "John Smith" },
          { id: 2, name: "Sarah Johnson" }
        ]
      }
    ],
    hints: {
      basic: "You need to join three tables: projects, project_assignments, and employees.",
      medium: "Use multiple JOINs: projects -> project_assignments -> employees. Use LEFT JOIN to include all projects.",
      detailed: "Write: SELECT p.name AS project_name, e.name AS employee_name, pa.role FROM projects p LEFT JOIN project_assignments pa ON p.id = pa.project_id LEFT JOIN employees e ON pa.employee_id = e.id;"
    }
  },
  {
    title: "Order Statistics",
    description: "Calculate total order value and average order value for each customer.",
    difficulty: "intermediate",
    requirements: "Join customers and orders tables. Use SUM() and AVG() aggregate functions with GROUP BY.",
    expectedOutput: [
      { column: "customer_name", type: "string" },
      { column: "total_orders", type: "integer" },
      { column: "total_value", type: "decimal" },
      { column: "average_value", type: "decimal" }
    ],
    tables: [
      {
        name: "customers",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "Acme Corp" },
          { id: 2, name: "GlobalTech" }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "integer" },
          { name: "customer_id", type: "integer" },
          { name: "total_amount", type: "decimal" },
          { name: "status", type: "varchar" }
        ],
        sampleData: [
          { id: 1, customer_id: 1, total_amount: 15000, status: "completed" },
          { id: 2, customer_id: 1, total_amount: 8500, status: "completed" },
          { id: 3, customer_id: 2, total_amount: 12000, status: "completed" }
        ]
      }
    ],
    hints: {
      basic: "Join customers with orders, then group by customer to calculate aggregate statistics.",
      medium: "Use COUNT(*) for total orders, SUM(total_amount) for total value, and AVG(total_amount) for average. GROUP BY customer_id and customer name.",
      detailed: "Write: SELECT c.name AS customer_name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_value, ROUND(AVG(o.total_amount), 2) AS average_value FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;"
    }
  },
  {
    title: "Subquery: Expensive Orders",
    description: "Find all orders that are above the average order value.",
    difficulty: "advanced",
    requirements: "Use a subquery to calculate the average and filter orders greater than that average.",
    expectedOutput: [
      { column: "order_id", type: "integer" },
      { column: "customer_id", type: "integer" },
      { column: "total_amount", type: "decimal" }
    ],
    tables: [
      {
        name: "orders",
        columns: [
          { name: "id", type: "integer" },
          { name: "customer_id", type: "integer" },
          { name: "total_amount", type: "decimal" },
          { name: "order_date", type: "date" }
        ],
        sampleData: [
          { id: 1, customer_id: 1, total_amount: 15000 },
          { id: 2, customer_id: 2, total_amount: 8500 },
          { id: 3, customer_id: 3, total_amount: 12000 }
        ]
      }
    ],
    hints: {
      basic: "Use a subquery to first calculate the average order value, then filter orders using that value.",
      medium: "The subquery (SELECT AVG(total_amount) FROM orders) returns the average. Use > comparison in the WHERE clause.",
      detailed: "Write: SELECT id AS order_id, customer_id, total_amount FROM orders WHERE total_amount > (SELECT AVG(total_amount) FROM orders);"
    }
  },
  {
    title: "Complex Join: Multi-table Analysis",
    description: "Find customers who have ordered products with total value over $10,000, including their order details.",
    difficulty: "advanced",
    requirements: "Join customers, orders, and order_items. Use aggregate functions and HAVING to filter groups.",
    expectedOutput: [
      { column: "customer_name", type: "string" },
      { column: "order_count", type: "integer" },
      { column: "total_spent", type: "decimal" }
    ],
    tables: [
      {
        name: "customers",
        columns: [
          { name: "id", type: "integer" },
          { name: "name", type: "varchar" }
        ],
        sampleData: [
          { id: 1, name: "Acme Corp" },
          { id: 2, name: "GlobalTech" }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "integer" },
          { name: "customer_id", type: "integer" },
          { name: "total_amount", type: "decimal" }
        ],
        sampleData: [
          { id: 1, customer_id: 1, total_amount: 15000 },
          { id: 2, customer_id: 1, total_amount: 9500 }
        ]
      },
      {
        name: "order_items",
        columns: [
          { name: "id", type: "integer" },
          { name: "order_id", type: "integer" },
          { name: "product_name", type: "varchar" },
          { name: "quantity", type: "integer" },
          { name: "unit_price", type: "decimal" }
        ],
        sampleData: [
          { id: 1, order_id: 1, product_name: "Laptop Pro", quantity: 10, unit_price: 1200 },
          { id: 2, order_id: 2, product_name: "Monitor", quantity: 5, unit_price: 400 }
        ]
      }
    ],
    hints: {
      basic: "Join three tables together, then filter using HAVING to show only high-value customers.",
      medium: "Join customers -> orders -> order_items. Group by customer and use HAVING SUM(quantity * unit_price) > 10000.",
      detailed: "Write: SELECT c.name AS customer_name, COUNT(DISTINCT o.id) AS order_count, SUM(oi.quantity * oi.unit_price) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id GROUP BY c.id, c.name HAVING SUM(oi.quantity * oi.unit_price) > 10000;"
    }
  }
];

async function seedAssignments() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🌱 Seeding MongoDB assignments...');
    
    await client.connect();
    const db = client.db(DB_NAME);
    
    // Clear existing assignments
    await db.collection('assignments').deleteMany({});
    
    // Insert new assignments
    const result = await db.collection('assignments').insertMany(assignments);
    
    console.log(`✓ Inserted ${result.insertedCount} assignments`);
    console.log('\n📚 Assignments seeded:');
    assignments.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.title} (${a.difficulty})`);
    });
    
  } catch (error) {
    console.error('Error seeding assignments:', error);
  } finally {
    await client.close();
  }
};

seedAssignments();
