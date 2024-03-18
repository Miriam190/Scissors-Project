const express = require("express");
const controller = require("../controller/urlController");
const router = express.Router();

router.get("/:urlId", controller.redirectLink);

module.exports = router;
