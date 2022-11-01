const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/comment");

router.post("/:todo_id", AuthMiddleware, controller.createComment);
router.get("/:todo_id/comment", AuthMiddleware, controller.readAllComment);
router.patch("/:todo_id/:id", AuthMiddleware, controller.updatecomment);
router.delete("/:todo_id/:id", AuthMiddleware, controller.deleteOneComment);

module.exports = router;