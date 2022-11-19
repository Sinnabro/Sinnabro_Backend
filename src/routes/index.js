const express = require("express");
const router = express();

const User = require("./user");
const Todo = require('./todo');
const Comment = require("./comment");
const Date = require("./date");
const List = require("./list")

router.use("/user", User);
router.use("/todo", Todo);
router.use("/todo", Comment);
router.use("/date", Date);
router.use("/list", List);

module.exports = router;