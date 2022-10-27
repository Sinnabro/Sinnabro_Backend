const express = require('express');
const router = express();

const controller = require('../controllers/todo');

router.post('/', controller.writeTodo);

module.exports = router;