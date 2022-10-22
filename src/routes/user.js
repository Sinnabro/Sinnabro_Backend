const express = require("express");
const router = express();

const controller = require("../controllers/user");

router.post("/signup", controller.signup);
router.post("/namecheck", controller.namecheck);

module.exports = router;