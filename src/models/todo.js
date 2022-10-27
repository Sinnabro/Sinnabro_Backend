const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("todo", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        writer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sub: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        check: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        }
    });
};