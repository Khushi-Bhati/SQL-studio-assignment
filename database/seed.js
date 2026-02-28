const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'ciphersqlstudio'
});

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create tables
    await client.query(`
      -- Employees table
      DROP TABLE IF EXISTS employees CASCADE;
      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        department_id INTEGER,
        salary DECIMAL(10, 2) NOT NULL,
        hire_date DATE NOT NULL,
        manager_id INTEGER
      );
      
      -- Departments table
      DROP TABLE IF EXISTS departments CASCADE;
      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        budget DECIMAL(12, 2)
      );
      
      -- Projects table
      DROP TABLE IF EXISTS projects CASCADE;
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department_id INTEGER,
        start_date DATE,
        status VARCHAR(20) DEFAULT 'active'
      );
      
      -- Project assignments table
      DROP TABLE IF EXISTS project_assignments CASCADE;
      CREATE TABLE project_assignments (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        project_id INTEGER REFERENCES projects(id),
        role VARCHAR(50),
        hours_allocated INTEGER DEFAULT 0
      );
      
      -- Customers table
      DROP TABLE IF EXISTS customers CASCADE;
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        country VARCHAR(50),
        signup_date DATE
      );
      
      -- Orders table
      DROP TABLE IF EXISTS orders CASCADE;
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        order_date DATE NOT NULL,
        total_amount DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT 'pending'
      );
      
      -- Order items table
      DROP TABLE IF EXISTS order_items CASCADE;
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_name VARCHAR(100),
        quantity INTEGER,
        unit_price DECIMAL(8, 2)
      );
    `);
    
    console.log('✓ Tables created');
    
    // Insert sample data
    await client.query(`
      -- Departments
      INSERT INTO departments (name, location, budget) VALUES
        ('Engineering', 'Building A', 500000),
        ('Marketing', 'Building B', 200000),
        ('Sales', 'Building B', 300000),
        ('HR', 'Building C', 100000),
        ('Finance', 'Building C', 150000),
        ('Operations', 'Building A', 250000);
      
      -- Employees
      INSERT INTO employees (name, email, department_id, salary, hire_date, manager_id) VALUES
        ('John Smith', 'john.smith@company.com', 1, 85000, '2020-01-15', NULL),
        ('Sarah Johnson', 'sarah.johnson@company.com', 1, 75000, '2020-03-20', 1),
        ('Michael Brown', 'michael.brown@company.com', 1, 70000, '2021-06-01', 1),
        ('Emily Davis', 'emily.davis@company.com', 2, 65000, '2021-09-10', NULL),
        ('David Wilson', 'david.wilson@company.com', 2, 60000, '2022-01-15', 4),
        ('Jessica Taylor', 'jessica.taylor@company.com', 3, 70000, '2020-08-01', NULL),
        ('Robert Anderson', 'robert.anderson@company.com', 3, 68000, '2021-04-20', 6),
        ('Jennifer Martinez', 'jennifer.martinez@company.com', 3, 65000, '2022-03-15', 6),
        ('William Thomas', 'william.thomas@company.com', 4, 55000, '2021-11-01', NULL),
        ('Amanda Garcia', 'amanda.garcia@company.com', 5, 72000, '2020-05-10', NULL),
        ('Christopher Lee', 'christopher.lee@company.com', 6, 62000, '2021-07-25', NULL),
        ('Lisa White', 'lisa.white@company.com', 1, 80000, '2019-12-01', 1),
        ('Daniel Harris', 'daniel.harris@company.com', 2, 58000, '2022-06-10', 4),
        ('Michelle Clark', 'michelle.clark@company.com', 3, 63000, '2021-10-05', 7),
        ('Kevin Lewis', 'kevin.lewis@company.com', 1, 68000, '2022-08-20', 2);
      
      -- Projects
      INSERT INTO projects (name, department_id, start_date, status) VALUES
        ('Website Redesign', 1, '2023-01-01', 'active'),
        ('Mobile App', 1, '2023-03-15', 'active'),
        ('Q1 Marketing Campaign', 2, '2023-01-01', 'completed'),
        ('Sales Dashboard', 3, '2023-02-01', 'active'),
        ('Employee Portal', 4, '2023-04-01', 'active'),
        ('Cloud Migration', 6, '2023-05-01', 'active'),
        ('Brand Refresh', 2, '2023-06-01', 'active');
      
      -- Project Assignments
      INSERT INTO project_assignments (employee_id, project_id, role, hours_allocated) VALUES
        (1, 1, 'Lead Developer', 20),
        (2, 1, 'Backend Developer', 30),
        (3, 1, 'Frontend Developer', 30),
        (1, 2, 'Technical Lead', 15),
        (12, 2, 'Senior Developer', 30),
        (2, 2, 'Developer', 10),
        (4, 3, 'Campaign Manager', 40),
        (5, 3, 'Marketing Specialist', 40),
        (6, 4, 'Project Lead', 25),
        (7, 4, 'Developer', 30),
        (8, 4, 'Designer', 30),
        (9, 5, 'Project Lead', 35),
        (10, 6, 'Project Manager', 40),
        (11, 6, 'DevOps Engineer', 40),
        (4, 7, 'Creative Director', 30),
        (13, 7, 'Designer', 35);
      
      -- Customers
      INSERT INTO customers (name, email, country, signup_date) VALUES
        ('Acme Corp', 'orders@acme.com', 'USA', '2022-01-10'),
        ('GlobalTech', 'procurement@globaltech.com', 'USA', '2022-02-15'),
        ('EuroTrade GmbH', 'buy@eurotrade.de', 'Germany', '2022-03-20'),
        ('Asia Pacific Ltd', 'orders@apac.com', 'Singapore', '2022-04-05'),
        ('Nordic Solutions', 'purchasing@nordic.se', 'Sweden', '2022-05-12'),
        ('British Imports', 'orders@britishimports.co.uk', 'UK', '2022-06-18'),
        ('Canadian Exports', 'procurement@canex.ca', 'Canada', '2022-07-22'),
        ('Brazilian Trade', 'compras@brtrade.br', 'Brazil', '2022-08-30'),
        ('Australian Group', 'orders@ausgroup.com.au', 'Australia', '2022-09-14'),
        ('Mexican Partners', 'compras@mexpartners.mx', 'Mexico', '2022-10-25'),
        ('TechStart Inc', 'orders@techstart.io', 'USA', '2023-01-05'),
        ('DataFlow Ltd', 'procurement@dataflow.co.uk', 'UK', '2023-02-10'),
        ('CloudNine', 'orders@cloudnine.com', 'USA', '2023-03-15'),
        ('InnovateTech', 'buy@innovatetech.de', 'Germany', '2023-04-20'),
        ('FutureSoft', 'orders@futuresoft.com', 'Canada', '2023-05-25');
      
      -- Orders
      INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES
        (1, '2023-01-15', 15000.00, 'completed'),
        (2, '2023-01-20', 8500.00, 'completed'),
        (3, '2023-02-05', 12000.00, 'completed'),
        (1, '2023-02-10', 9500.00, 'completed'),
        (4, '2023-02-25', 18000.00, 'shipped'),
        (5, '2023-03-01', 7500.00, 'completed'),
        (6, '2023-03-10', 11000.00, 'shipped'),
        (2, '2023-03-15', 6500.00, 'pending'),
        (7, '2023-03-20', 9000.00, 'completed'),
        (8, '2023-04-05', 14500.00, 'shipped'),
        (3, '2023-04-10', 8000.00, 'pending'),
        (9, '2023-04-15', 10500.00, 'completed'),
        (10, '2023-04-20', 9200.00, 'shipped'),
        (11, '2023-05-01', 13000.00, 'pending'),
        (12, '2023-05-10', 7800.00, 'completed'),
        (13, '2023-05-15', 11500.00, 'shipped'),
        (14, '2023-05-20', 8900.00, 'pending'),
        (15, '2023-06-01', 12500.00, 'completed'),
        (1, '2023-06-10', 10200.00, 'pending'),
        (4, '2023-06-15', 9800.00, 'shipped');
      
      -- Order Items
      INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
        (1, 'Laptop Pro', 10, 1200.00),
        (1, 'Wireless Mouse', 10, 50.00),
        (2, 'Monitor 27"', 5, 400.00),
        (2, 'Keyboard', 5, 80.00),
        (3, 'Desktop Workstation', 3, 3500.00),
        (4, 'Laptop Pro', 5, 1200.00),
        (4, 'USB-C Hub', 5, 70.00),
        (5, 'Server Rack', 2, 6000.00),
        (5, 'Network Switch', 3, 1000.00),
        (6, 'Printer', 5, 800.00),
        (6, 'Scanner', 5, 400.00),
        (7, 'Conference Phone', 10, 250.00),
        (7, 'Webcam HD', 10, 80.00),
        (8, 'Tablet 10"', 5, 600.00),
        (9, 'Router Enterprise', 3, 1500.00),
        (10, 'Firewall Appliance', 2, 4500.00),
        (10, 'Access Point', 5, 200.00),
        (11, 'Storage Array', 1, 7000.00),
        (12, 'Laptop Air', 7, 1000.00),
        (13, 'Monitor 32"', 5, 600.00),
        (13, 'Standing Desk', 5, 800.00),
        (14, 'Ergonomic Chair', 10, 450.00),
        (15, 'Server Blade', 4, 2500.00),
        (16, 'Network Cable Kit', 20, 50.00),
        (17, 'Power Strip', 30, 30.00),
        (18, 'Docking Station', 8, 150.00),
        (19, 'External SSD 1TB', 10, 120.00),
        (20, 'Wireless Keyboard', 15, 70.00);
    `);
    
    console.log('✓ Sample data inserted');
    console.log('\n📊 Database seeding completed successfully!');
    console.log('\nTables created:');
    console.log('  - employees (15 rows)');
    console.log('  - departments (6 rows)');
    console.log('  - projects (7 rows)');
    console.log('  - project_assignments (16 rows)');
    console.log('  - customers (15 rows)');
    console.log('  - orders (20 rows)');
    console.log('  - order_items (29 rows)');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

seedData();
