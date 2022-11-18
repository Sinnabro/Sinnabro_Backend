const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/list');

router.get('/', AuthMiddleware, controller.getlist);

module.exports = router;