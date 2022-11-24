const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/time');

router.post('/', AuthMiddleware, controller.createTime);

module.exports = router;