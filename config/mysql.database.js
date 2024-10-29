const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");

// Load environment variables
const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "000000";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "user";

// Initialize Sequelize with MySQL database
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: "mysql",
});

module.exports = sequelize;
