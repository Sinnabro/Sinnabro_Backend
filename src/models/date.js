const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("date", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayname: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Dday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
