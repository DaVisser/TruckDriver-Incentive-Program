const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 8081;
app.use(cors({
    origin: 'http://localhost:3000' // Allow only the React app to make requests in this case from my laptop running locally.
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


app.post('/insertProduct', async(req, res) => {
    const { productName, thumbnail, price, sponsorName } = req.body;
    // Do some basic SQL to take the data payload from the React Page and deal with it here and insert into our MySQL db.
    const sql = `INSERT INTO Products (productName, thumbnail, price, sponsorName) VALUES (?, ?, ?, ?)`;

    db.query(sql, [productName, thumbnail, price, sponsorName], (error, results, fields) => {
        if (error) return res.status(500).send({ error });
        res.send({ message: 'Product inserted successfully', data: results });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM Products';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).send({ error });
        }
        res.send(results);
    });
});