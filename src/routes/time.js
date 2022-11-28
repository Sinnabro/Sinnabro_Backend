const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/time');

router.post('/', AuthMiddleware, controller.createTime);
router.get('/', AuthMiddleware, controller.getTime);

module.exports = router;