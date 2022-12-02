const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config');
const db = {};

const sequelize = new Sequelize({...config, sync: false});

db.User = require("./user")(sequelize, Sequelize);
db.Todo = require("./todo")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.Date = require("./date")(sequelize, Sequelize);
db.Time = require('./time')(sequelize, Sequelize);
db.Like = require('./like')(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Todo, { foreignKey: "writer", targetKey: "id" });
db.Todo.belongsTo(db.User, { foreignKey: "writer" });

db.User.hasMany(db.Comment, { foreignKey: "user_id", targetKey: "id" });
db.Comment.belongsTo(db.User, { foreignKey: "user_id" });

db.Time.hasMany(db.Comment, { foreignKey: "time_id", targetKey: "id" });
db.Comment.belongsTo(db.Time, { foreignKey: "time_id" });

db.User.hasMany(db.Date, { foreignKey: "user_id", targetKey: "id" });
db.Date.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Time, { foreignKey: "user_id", targetKey: "id"});
db.Time.belongsTo(db.User, { foreignKey: "user_id"});

db.User.hasMany(db.Like, { foreignKey: "user_id", targetKey: "id"});
db.Like.belongsTo(db.User, { foreignKey: "user_id"});

db.Time.hasMany(db.Like, { foreignKey: "time_id", targetKey: "id"});
db.Like.belongsTo(db.Time, { foreignKey: "time_id"});

module.exports = db;