const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(),
            allowNull: false
        }
    });
};