const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/comment");

router.post("/:todo_id", AuthMiddleware, controller.createComment);
router.delete("/:todo_id/:id", AuthMiddleware, controller.deleteOneComment);
router.patch("/:todo_id/:id", AuthMiddleware, controller.updatecomment);

module.exports = router;