const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/todo');

router.post('/', AuthMiddleware, controller.createTodo);
router.patch('/:todo_id', AuthMiddleware, controller.updateTodo);
router.get('/', AuthMiddleware, controller.getTodo);
router.delete('/:todo_id', AuthMiddleware, controller.deleteTodo);

module.exports = router;