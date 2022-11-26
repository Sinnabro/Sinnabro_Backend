const express = require("express");
const router = express();

const User = require("./user");
const Todo = require('./todo');
const Comment = require("./comment");
const Date = require("./date");
const List = require("./list")
const Time = require('./time');

router.use("/user", User);
router.use("/todo", Todo);
router.use("/time", Comment);
router.use("/date", Date);
router.use("/list", List);
router.use('/time', Time);

module.exports = router;