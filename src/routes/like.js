const express = require('express');
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require('../controllers/like');

router.get('/:timeId', AuthMiddleware, controller.getLike);
router.post('/:timeId', AuthMiddleware, controller.CDLike);
router.delete('/:timeId', AuthMiddleware, controller.CDLike);

module.exports = router;