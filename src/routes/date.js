const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/date");

router.post("/", AuthMiddleware, controller.createDate);
router.get("/:user_id", AuthMiddleware, controller.readDate);
router.patch("/:user_id", AuthMiddleware, controller.updateDate);

module.exports = router;
