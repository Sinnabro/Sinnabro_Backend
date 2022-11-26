const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/comment");

router.post("/:time_id", AuthMiddleware, controller.createComment);
router.get("/:time_id/comment", AuthMiddleware, controller.readAllComment);
router.patch("/:time_id/:id", AuthMiddleware, controller.updatecomment);
router.delete("/:time_id/:id", AuthMiddleware, controller.deleteOneComment);

module.exports = router;