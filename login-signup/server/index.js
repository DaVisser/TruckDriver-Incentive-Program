const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3306;

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'Team06Admin',
    password: 'B5s3d1nb5t5!$?',
    database: 'UserDB'
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/signup', (req, res) => {
    const { email, password, firstname } = req.body;
    const user = { Email: email, Password: password, Firstname: firstname }; // Updated field names

    // Insert user into the database
    db.query('INSERT INTO Users SET ?', user, (err, result) => { // Updated table name to Users
        if (err) {
            console.error(err);
            res.status(500).send('Error signing up user');
            return;
        }
        console.log('User signed up successfully');
        res.sendStatus(200);
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists in the database
    db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => { // Updated table name to Users
        if (err) {
            console.error(err);
            res.status(500).send('Error logging in user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const user = results[0];
        if (user.Password !== password) {
            res.status(401).send('Invalid password');
            return;
        }

        // User authenticated successfully
        res.status(200).send('Login successful');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});