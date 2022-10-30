const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/comment");

router.post("/:todo_id", AuthMiddleware, controller.createComment);

module.exports = router;