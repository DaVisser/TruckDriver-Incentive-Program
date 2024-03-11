const mysql = require('mysql');

// Configure your database connection
const db = mysql.createConnection({
    host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'Team06Admin',
    password: 'B5s3d1nb5t5!$?',
    database: 'UserDB'
});

// Lambda handler function
exports.handler = (event, context, callback) => {
    // Ensure the Lambda function doesn't wait for the MySQL connection to close
    context.callbackWaitsForEmptyEventLoop = false;

    // SQL query
    const sql = "SELECT * FROM AboutPageInfo";

    // Query the database
    db.query(sql, (err, data) => {
        if (err) {
            // Return an error response
            callback(null, {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: err.message })
            });
        } else {
            // Return a successful response
            callback(null, {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
    });
};
