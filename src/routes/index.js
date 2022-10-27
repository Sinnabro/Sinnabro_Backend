const express = require("express");
const router = express();

const User = require("./user");
const Todo = require('./todo');

router.use("/user", User);
router.use("/todo", Todo);

module.exports = router;