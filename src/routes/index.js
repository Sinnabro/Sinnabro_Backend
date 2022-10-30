const express = require("express");
const router = express();

const User = require("./user");
const Todo = require('./todo');
const Comment = require("./comment");

router.use("/user", User);
router.use("/todo", Todo);
router.use("/todo", Comment);

module.exports = router;