const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const Log = sequelize.define(
    "Log",
    {
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Mark as part of the composite primary key
        },
        printerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Mark as part of the composite primary key
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startPrintTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endPrintTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        numberOfPages: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "print_log",
        timestamps: true, // This will automatically manage createdAt and updatedAt fields
    }
);

module.exports = Log;
