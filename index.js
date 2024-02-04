const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database configuration
const config = {
  host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',    // Replace with your MySQL host (e.g., localhost)
  user: 'Team06Admin',    // Replace with your MySQL username
  password: 'B5s3d1nb5t5!$?',    // Replace with your MySQL password
  database: 'UserDB',    // Replace with your MySQL database name
};

// Create a MySQL pool
const pool = mysql.createPool(config).promise();

// API endpoint to get the list of table names from the database
app.get('/', async (req, res) => {
  try {
    // Query to get the list of tables
    const [rows] = await pool.query(`
    SHOW TABLES;
`);

    // Extract table names from the result
    const tableNames = rows.map(table => table.table_name);

    // Display the list of tables
    res.send(`<h1>Tables in the Database:</h1><pre>${tableNames.join('\n')}</pre>`);
  } catch (error) {
    // Log the error
    console.error('Error querying the database:', error);

    // Send a more informative response to the client
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});