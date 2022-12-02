const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("like", {
        time_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'Like',
        tableName: 'likes',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
};