const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/todo');

router.post('/', AuthMiddleware, controller.createTodo);
router.patch('/:todo_id', AuthMiddleware, controller.updateTodo);

module.exports = router;