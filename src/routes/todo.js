const express = require('express');
const router = express();

const AuthMiddleware = require("../middleware/token");
const controller = require('../controllers/todo');

router.post('/', AuthMiddleware, controller.writeTodo);

module.exports = router;