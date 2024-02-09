const http = require('http');
const url = require('url');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create a connection pool for MySQL
const db = mysql.createPool({
    port: "3306",
    host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'Team06Admin',
    password: 'B5s3d1nb5t5!$?',
    database: 'UserDB'
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);
    // Parse the request body
    let requestBody = '';
    req.on('data', chunk => {
        requestBody += chunk.toString();
    });
    req.on('end', () => {
        // Handle POST requests
        if (req.method === 'POST') {
            // Parse the request body as JSON
            const body = JSON.parse(requestBody);
            // Handle signup route
            if (parsedUrl.pathname === '/signup') {
                const { email, password, firstname } = body;
                const user = { Email: email, Password: password, Firstname: firstname };
                // Insert user into the database
                db.query('INSERT INTO Users SET ?', user, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error signing up user');
                        return;
                    }
                    console.log('User signed up successfully');
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('User signed up successfully');
                });
            }
            // Handle login route
            else if (parsedUrl.pathname === '/login') {
                const { email, password } = body;
                // Check if user exists in the database
                db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error logging in user');
                        return;
                    }
                    if (results.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('User not found');
                        return;
                    }
                    const user = results[0];
                    if (user.Password !== password) {
                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                        res.end('Invalid password');
                        return;
                    }
                    // User authenticated successfully
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Login successful');
                });
            }
        }
    });
});

// Start the server
const port = 3306;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});