const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        date: {
            type: DataTypes.TEXT,
        },
        one: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        two: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        three: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        four: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        five: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        six: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        seven: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        eight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        nine: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ten: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        eleven: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twelve: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        thirteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        fourteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        fifteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        sixteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        seventeen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        eigthteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        nineteen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twenty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twentyone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twentytwo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twentythree: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        twentyfour: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'Time',
        tableName: 'times',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
};