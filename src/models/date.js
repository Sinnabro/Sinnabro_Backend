const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("date", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dayname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Dday: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};