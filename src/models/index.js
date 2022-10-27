const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config');
const db = {};

const sequelize = new Sequelize({...config, sync:true});

db.User = require("./user")(sequelize, Sequelize);
db.Todo = require("./todo")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Todo, {foriegnKey: "id", targetKey: "user_id"});
db.Todo.belongsTo(db.User, {foriegnKey: "user_id"});

module.exports = db;