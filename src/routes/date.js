const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/date");

router.post("/", AuthMiddleware, controller.createDate);
router.patch("/:id", AuthMiddleware, controller.updateDate);
router.delete("/:id", AuthMiddleware, controller.deleteDate);

module.exports = router;