const express = require("express");
const controller = require("../controller/userController");
const router = express.Router();


router.post("/", controller.signup);
router.post("/login", controller.login);

module.exports = router;
