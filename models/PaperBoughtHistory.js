const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const PaperBoughtHistory = sequelize.define(
    "PaperBoughtHistory",
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true
        },
        studentUserName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        noOfPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalBill: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        }
    },
    {
        tableName: "PaperBoughtHistories",
    }
)
// PaperBoughtHistory.sync({alter: true})

module.exports = {PaperBoughtHistory}