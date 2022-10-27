const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("todo", {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        sub: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        check: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        }
    },{
        sequelize,
        modelName: 'todo',
        tableName: 'Todo',
        underscored: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    })
};