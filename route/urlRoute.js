const express = require("express");
const controller = require("../controller/urlController");
const router = express.Router();
const {authenticateUser} = require("../middleware/authentication");
const GetCache = require('../middleware/cache');

router.post("/", authenticateUser, controller.post);
if (process.env.NODE_ENV === 'test') {
    router.get("/history",  authenticateUser, controller.urlHistory);
    router.get("/analytics", authenticateUser, controller.urlAnalytics);
  }
router.get("/history", GetCache,  authenticateUser, controller.urlHistory);
router.get("/analytics", GetCache, authenticateUser, controller.urlAnalytics);

module.exports = router;
