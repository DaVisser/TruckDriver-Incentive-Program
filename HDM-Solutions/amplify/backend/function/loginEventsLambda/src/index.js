const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');

const app = express();

app.use(cors({
    // Ensure this is configured correctly for your production environment
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "Team06Admin",
    password: "B5s3d1nb5t5!$?",
    database: "UserDB",
});

db.connect();

app.get('/', (req, res) => {
    res.send('Welcome to the Server! Use specific endpoints to interact with the database.');
});

app.get('/loginevents', (req, res) => {
    const sql = 'SELECT * FROM LoginEvents;';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching login events:', error);
            return res.status(500).send({ error });
        }
        res.send(results);
    });
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
