import mysql from 'mysql';

// Setup the MySQL connection pool
const pool = mysql.createPool({
  host: "team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com",
  user: "Team06Admin",
  password: "B5s3d1nb5t5!$?",
  database: "UserDB",
});

export const handler = async (event, context) => {
  // Prevent Lambda from waiting for the MySQL connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  // SQL query to select data from the AboutPageInfo table
  const sql = "SELECT * FROM AboutPageInfo";

  // Promise wrapper for the MySQL query
  const query = (sql) => new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

  try {
    // Execute the query and get the results
    const data = await query(sql);
    console.log('Successfully retrieved data from AboutPageInfo:', data);

    // Return a successful response with the data
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error querying AboutPageInfo:', error);

    // Return an error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
