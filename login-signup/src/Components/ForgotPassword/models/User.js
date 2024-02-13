const { Model, DataTypes } = require('sequelize');
const sequelize = require('.../Config/database'); 

class User extends Model {}

User.init({
  UserId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TruckingLicense: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ResetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ResetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: false // Assuming you're not using Sequelize's built-in createdAt & updatedAt
});

module.exports = User;
