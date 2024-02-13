const { Sequelize } = require('sequelize');

// Create a new Sequelize instance with your database connection details
const sequelize = new Sequelize('UserDB', 'Team06Admin', 'B5s3d1nb5t5!$?', {
  host: 'team06-dbserver.cobd8enwsupz.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  logging: false, // Turn off logging or set to console.log for debugging

  // Additional Sequelize configuration options as needed
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;
