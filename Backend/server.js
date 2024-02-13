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
//Adding comment so I can try merging this branch to master.
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

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, licenseNum, phoneNumber, action } = req.body;
    //Do some basic SQL to take the data payload from the React Page and deal with it here and insert into our mysql db.
    const sql = `INSERT INTO Users (UserName, FirstName, LastName, Email, Password, PhoneNumber, TruckingLicense) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    // Generate a salt and hash the password
    const saltRounds = 10; // It's a cost factor for how much time is needed to calculate a single bcrypt hash.
    const hashedPassword = await bcrypt.hash(password, saltRounds);
     
    const firstNameParse = firstName.substring(0,1);
    const lastNameParse = lastName.substring(0,6);
    const Username = (lastNameParse + firstNameParse).toLowerCase();
    
    db.query(sql, [Username,firstName, lastName, email, hashedPassword, phoneNumber, licenseNum], (error, results, fields) => {
        if (error) return res.status(500).send({ error });
        res.send({ message: 'User data saved successfully', data: results });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//grabs the current users in the Users table in UserDB
app.get("/users",(req, res)=>{
    const sql = "Select * from Users";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
