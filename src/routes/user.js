const express = require("express");
const router = express();
const AuthMiddleware = require("../middleware/token");

const controller = require("../controllers/user");

router.post("/signup", controller.signup);
router.post("/namecheck", controller.namecheck);
router.post("/login", controller.login);
router.delete("/", AuthMiddleware, controller.deleteUser);
router.patch("/password", AuthMiddleware, controller.updatePassword);
router.post("/email", controller.sendEmail);
router.get("/mypage", AuthMiddleware, controller.mypage);

module.exports = router;