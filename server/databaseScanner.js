const mysql = require("mysql");
const db = mysql.createConnection({
    host: "team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "Team06Admin",
    password: "B5s3d1nb5t5!$?",
    database: "UserDB",
});

db.connect((err) => {
    if (err) {
      console.log(err.message);
      return;
    }
  
    console.log("Database connected.");
  
    // Query to retrieve all table names
    const query = 'SHOW TABLES';
  
    db.query(query, (error, results, fields) => {
      if (error) {
        console.log("Error retrieving table names:");
        console.log(error.message);
        return;
      }
  
      console.log("Tables in the database:");
      results.forEach((row) => {
        console.log(row[`Tables_in_${db.config.database}`]);
      });
  
      // Now that we've shown the tables, you might want to perform other operations here.
  
      // Finally, end the database connection
      db.end((endErr) => {
        if (endErr) {
          console.log("Error ending database connection:");
          console.log(endErr.message);
        } else {
          console.log("Database connection closed.");
        }
      });
    });
  });