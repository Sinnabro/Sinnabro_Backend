const express = require("express");
const router = express();

const User = require("./user");
const Todo = require('./todo');
const Comment = require("./comment");
const Date = require("./date");

router.use("/user", User);
router.use("/todo", Todo);
router.use("/todo", Comment);
router.use("/date", Date);

module.exports = router;