const express = require('express');
const mysql = require('mysql');

const app = express();

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'Team06Admin',
    password: 'B5s3d1nb5t5!$?',
    database: 'UserDB', // Update to the correct database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully');

    // Execute the SQL query
    connection.query('SELECT UserId, UserName, Points FROM Users WHERE Role = ?', ['Driver'], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Query results:', results);


        // Set appropriate CORS headers to allow cross-origin requests
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });

        // Send the data to the React component
        app.get('/users', (req, res) => {
            res.json(results);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});